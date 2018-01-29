const request = require('request');
const cheerio = require('cheerio');

request('https://www.muthead.com/prices/xbox-one', (error, response, body) => {

  let $ = cheerio.load(body);

  let newest = $('.newest-most-expensive > ul')[0];
  let list = newest.children.filter(tag => {
    return tag.name === 'li';
  });

  list = list.reduce((acc, el) => {
    if (el.name === 'li') {
        if (el.children) {
            let playerData = el.children.filter(child => {
                return child.type === 'tag';
            });
            // building profile from different objects
            let player = playerData.reduce((acc, item) => {
                // console.log('-------------------');
                // console.log('----- item :', item);
                if (item.attribs.class && item.children.length < 1) {
                    acc['team'] = item.attribs.class.toUpperCase();
                }
                else if (item.attribs.href) {
                    acc['name'] = item.children[0].data;
                    acc['link'] = item.attribs.href;
                }
                else if (item.attribs.class && item.children) {
                    acc['type'] = item.attribs.class;
                    acc['data'] = item.children[0].data;
                }
                return acc;
            }, {});

            acc.push(player);
        }
    }
    return acc;
  }, []);
  console.log('--------------------');
  console.log('------ NEWEST ------');
  console.log('--------------------');
  console.log(list);
});