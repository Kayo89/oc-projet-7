const DATE_FORMATER = require( 'dateformat' );

function Reply(user_id, article_id, reply_txt){
  this.user_id = user_id;
  this.article_id = article_id;
  this.reply_txt = reply_txt;
  this.date_created = DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" );
}

module.exports = Reply;