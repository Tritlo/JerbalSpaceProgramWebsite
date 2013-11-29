//Here we set the appcache, to enable true local play
//firefox explicitly askes for permission, and we don't want
//that to interfere with the experience. Thus we 
//disallow firefox
Meteor.AppCache.config({firefox: false});
