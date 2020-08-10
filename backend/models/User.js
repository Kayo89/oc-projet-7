const DATE_FORMATER = require( 'dateformat' );

function User(email, password, lastName, firstName){
  this.email = email;
  this.password = password;
  this.last_name = lastName;
  this.first_name = firstName;
  this.account_created = DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" );
}

module.exports = User;