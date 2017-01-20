
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('content_sources').del(), 

    knex('content_sources').insert({id: 1, content_provider_id: 1, category_id: 1, url: 'http://rss.cnn.com/rss/cnn_allpolitics.rss'}),
    knex('content_sources').insert({id: 2, content_provider_id: 2, category_id: 1, url: 'http://feeds.foxnews.com/foxnews/politics'})
  );
};
