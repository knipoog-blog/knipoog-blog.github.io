const feeds = require('./blogs.json');
const fetch = require('node-fetch');
const FeedParser = require('feedparser');
const sanitizeHtml = require('sanitize-html');
const linkscrape = require('linkscrape');
const http = require('http');
const https = require('https');
const path = require('path');
const sharp = require('sharp');
const queue = require('queue');
const fs = require('fs');
const thumbsFolder = path.join(__dirname, '../src/assets/thumbs');
const dataFolder = path.join(__dirname, '../src/assets/data');
const q = queue({
    concurrency: 1,
    autostart: true,
});

/**
 * Takes the RSS XML and converts it to JSON
 * Implements node-feedparser and turns it into a Promise
 * @param body
 * @returns {Promise<{items, post}>}
 */
const parseFeed = ({body}) => {
    return new Promise((resolve, reject) => {
        const feedparser = new FeedParser();
        const items = [];
        body.pipe(feedparser);

        feedparser.on('error', function (error) {
            reject(error);
        });

        feedparser.on('readable', function () {
            // This is where the action is!
            var stream = this; // `this` is `feedparser`, which is a stream
            let item = stream.read();

            while (item) {
                items.push(item);
                item = stream.read();
            }
        });
        feedparser.on('end', () => resolve({items}));

    });
};
const createThumbnailForPost = (post, site) => {
    const folder = path.join(thumbsFolder, site.id);
    const filePath = path.join(folder, `${post.slug}.jpg`);
    if (fs.existsSync(filePath)) {
        console.log(`[${site.id}/${post.slug}.jpg] File exists, skipping...`);
        return;
    }
    q.push((cb) => {
        console.log(`[${site.id}/${post.slug}.jpg] ${post.title}`);
        console.log(`[${site.id}/${post.slug}.jpg] Downloading...`);

        if (post.images.length === 0) {
            console.warn(`[${site.id}/${post.slug}.jpg] No images found!`);
            return;
        }
        if (!fs.existsSync(thumbsFolder)) {
            fs.mkdirSync(thumbsFolder);
        }
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }

        const stream = fs.createWriteStream(filePath);
        stream.on('finish', () => {
            console.log(`[${site.id}/${post.slug}.jpg] SUCCESS...`);
            cb();
        });
        const resizer =
            sharp()
                .resize(300, 300)
                .jpeg();

        const url = post.images[0];
        (url.startsWith("https") ? https : http).get(url, function (response) {
            response.on('error', (err) => {
                console.error(err);
                throw err;
            })
                .pipe(resizer).on('error', (err) => {
                console.error(`[${site.id}/${post.slug}] ${post.images[0]} failed resizing:`, err);
                throw err;
            })
                .pipe(stream).on('error', (err) => {
                console.error(err);
                throw err;
            });
        }).on('error', err => {
            console.error(err);
            throw err;
        });
    })
};

const createSlug = (post) => {
    return post.link.split("/").pop().replace(".html", "");
}
const processPost = (post, site) => {
    return new Promise((resolve) => {
        if (!post.summary) {
            resolve(null);
            return;
        }
        post.slug = createSlug(post);
        console.log(`[${site.id}/${post.slug}] Processing`);
        delete post.description;
        linkscrape('', post.summary, links => {
            post.summary = sanitize(post.summary);
            post.images = links
                .map(link => link.href)
                .filter(link =>
                  link.toLowerCase().endsWith("png") ||
                  link.toLowerCase().endsWith("jpg") ||
                  link.toLowerCase().includes("googleusercontent.com/img") ||
                  link.toLowerCase().endsWith("jpeg")
                );
            if (post.images.length === 0) {
                console.warn(`[${site.id}/${post.slug}] Skipping, no images found`);
                resolve(null);
                return;
            }
            console.log(`[${site.id}/${post.slug}] images: ${post.images.length}`);

            createThumbnailForPost(post, site);
            resolve(post);
        });
    });
};


const sanitize = dirty => sanitizeHtml(dirty, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'a'],
    allowedIframeHostnames: ['www.youtube.com'],
});

const readFeed = (site) => {
    const {id, url, title} = site;
    const fileName = path.resolve(dataFolder, `${id}.json`);
    return fetch(url)
        .then(parseFeed)
        .then(({items}) => {
            console.log(`[${site.id}] Process ${items.length} item(s)`);
            return Promise.all(items.map(item => processPost(item, site))).catch(err => {
                console.error(err);
            })
        })
        .then(posts => posts
            .filter(post => !!post)
            .map(post => ({
              title: post.title,
              summary: post.summary,
              date: post.date,
              slug: post.slug,
              category: {id, title},
              images: post.images,
            })))
      .then(posts => {
        fs.writeFileSync(fileName, JSON.stringify(posts));
        return posts;
      })
        .catch(e => {
            console.error(`Error while processing feed ${id}`);
            throw e;
        });
};

const readAllFeeds = () => {
    console.log('Fetching all blogs...');
    return Promise.all(feeds.map(readFeed)).then(results => {
      const posts = [].concat.apply([], results);

      /* Blogs */
      console.log('Writing blogs!', path.resolve(dataFolder, "blogs.json"));
      fs.writeFileSync(path.resolve(dataFolder, "blogs.json"), JSON.stringify(feeds));

      const routes = posts.map(post => `/${post.category.id}/${post.slug}`);
      feeds.forEach(site => {
        routes.push(`/${site.id}`)
      });
      fs.writeFileSync(path.resolve(dataFolder, "routes.txt"), routes.join("\r\n"));

      /* Routes */

      /* Latest posts */
        const latest = posts
          .sort((a, b) => {
            if (a.date < b.date) {
              return 1;
            }
            if (a.date > b.date) {
              return -1;
            }
            return 0;
          })
          .slice(0, 30);
        console.log('Writing latest posts!', path.resolve(dataFolder, "latest.json"));
        fs.writeFileSync(path.resolve(dataFolder, "latest.json"), JSON.stringify(latest));
    })
        .catch(e => {
            console.error(e);
        });
};

module.exports = {readFeed, readAllFeeds};
