const got = require('@/utils/got');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

const rootUrl = 'https://explainai.beehiiv.com';

module.exports = async (ctx) => {
    const res = await got(rootUrl);

    const $ = cheerio.load(res.data);

    const list = $('div.grid.grid-cols-1.gap-6.md\\:grid-cols-2.lg\\:grid-cols-3 > div');
    const item = list
        .map((_, item) => {
            const article = $(item);
            const pubDate = article.find('time').text();

            return {
                title: article.find('h2').text().trim(),
                description: article.find('.space-y-1 < p').text().trim(),
                link: article.find('.group > a').attr('href'),
                pubDate: dayjs(pubDate),
            };
        })
        .get();
    ctx.state.data = {
        title: $('head > title').text(),
        link: rootUrl,
        language: $('html').prop('lang'),
        description: $('meta[name=description]').attr('content'),
        item,
    };
};
