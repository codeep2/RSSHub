const got = require('@/utils/got');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

const rootUrl = 'https://blog.codeep.xyz';

module.exports = async (ctx) => {
    const res = await got(rootUrl);

    const $ = cheerio.load(res.data);

    const list = $('main article');
    const item = list
        .map((_, item) => {
            const article = $(item);
            const pubDate = article.find('header small').text().split('•')[0];

            return {
                title: article.find('header h2 > a').text().trim(),
                description: article.find('> p').text().trim(),
                link: article.find('header h2 > a').attr('href'),
                pubDate: dayjs(pubDate),
            };
        })
        .get();

    ctx.state.data = {
        title: $('head > title').text(),
        link: rootUrl,
        description: `codeep's blog`,
        item,
    };
};
