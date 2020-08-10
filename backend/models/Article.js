const DATE_FORMATER = require( 'dateformat' );

function Article(user_id, content_txt, title){
  this.user_id = user_id;
  this.title = title;
  this.content_txt = content_txt;
  this.date_created = DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" );
}

module.exports = Article;