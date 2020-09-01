const DATE_FORMATER = require( 'dateformat' );

function User(email, password, lastName, firstName, gender){
  this.email = email;
  this.password = password;
  this.last_name = lastName;
  this.first_name = firstName;
  this.gender = gender;
  if(gender === 'man'){
    this.photo_url = 'avatar-man.png'
  }else if (gender === 'woman'){
    this.photo_url = 'avatar-woman.png'
  }
  this.account_created = DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" );
}

module.exports = User;