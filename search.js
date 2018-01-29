const request = require('request');
const cheerio = require('cheerio');

const _cleanItem = data => {
  delete data.parent;
  delete data.prev;
  delete data.next;
  delete data.namespace;
  delete data['x-attribsNamespace'];
  delete data['x-attribsPrefix'];
  return data;
};

let searchTerms = 'landon+collins';
request('https://www.muthead.com/search?search=' + searchTerms, (error, response, body) => {

  let $ = cheerio.load(body);

  let newest = $('.listing-player-cards > tbody');
  let list = newest[0].children.filter(tag => {
    return tag.name === 'tr';
  });
  let playerCardResults = list.map(row => {
    row = _cleanItem(row);
    return {
      class: row.attribs.class,
      children: row.children.map(child => {
        child = _cleanItem(child);
        return child;
      })
    };
  });

  let buildPlayerCards = playerCardResults.map(data => {
    data = data.children.reduce((acc, player) => {
      if (player.attribs.class === 'col-name') {
        acc[player.attribs.class] = player.children.reduce((obj, item) => {
          if (item.type === 'tag') {
            obj[item.name] = item.attribs;
          }
          return obj;
        }, {});
        return acc;
      }
      else if (player.attribs.class === 'col-team') {
        return acc;
      }
      else {
        acc[player.attribs.class] = player.children[0].data;
        return acc;
      }
    }, {});
    return data;
  });

  console.log('|----------------------------|');
  console.log('|Searching for Landon Collins|');
  console.log('|----------------------------|');
  console.log(buildPlayerCards);
});