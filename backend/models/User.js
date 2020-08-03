const DATE_FORMATER = require( 'dateformat' );

function User(email, password){
  this.email = email;
  this.password = password;
  this.account_created = DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" );
}

module.exports = User;