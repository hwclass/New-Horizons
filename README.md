# New Horizons

New Horizons is link aggregation (or real-time social news) application. It is a AngularJS codebase and uses Firebase for the database. You can easily install your server (or free Firebase Hosting) and you can create your own community whatever subject you want.

Demo: https://newhorizons.firebaseapp.com/

Note: I am not professional coder. I am still studying on Javascript, AngularJS and Firebase. There may some bugs, error etc. If you find bug please create an issue. If you have a great idea for this application please create pull requests. I improve this application every day.

###Features
* Membership system (of course)
* Point system (Every user can give a point to post or comment)
* Users can delete own posts and comments
* Most popular system (It depends on Hacker News algorithm, you can see in below)
* Admin can delete all posts and comments

###Upcoming Features
- [ ] Admin panel
- [ ] Karma
- [ ] Profile page
- [ ] Advanced category system (users can create new category)
- [ ] Moderator system
- [ ] Report system
- [ ] Fastening feature (Admin can fasten some posts)
- [ ] Message system (Users can send message each other)
- [ ] Comment reply
- [ ] Invitation system

###Why I choose this name?

In fact, New Horizons is a spacecraft and its mission to take picture of Pluto, studying on Pluto system and Kuiper Belt. When I was coding this project, New Horizons arrived Pluto and took it's picture. Then I thought, this application's mission is almost similar with New Horizons. New Horizons discover something new for humanity. With this application you can discover something new for yourself on the internet.

###Why I created this application?

I think, link aggregation is very important for the internet. There are very useful websites and contents on the internet but most people doesn't know these. With this application, everybody can discover new contents easily. There are websites like Hacker News, Reddit etc. But some group of people may want to create a community like these and I'd like to help them with this application.

###Most Popular Algorithm
This algorithm depends on Hacker News Algorithm. That is;

`lastPoint = (P-1) / (T+2)^G`

P = numberOfPoint
T = now - post.date
G = 1.8

###Installation

1. Register Firebase.com and create an app. Then change link in [FB.js](/services/FB.js) with your app link :

    `var ref = new Firebase('https://yourappname.firebaseio.com');`

2. Install [Node.js](https://nodejs.org/download/).

3. Type for install firebase-tools:

    `$ sudo npm install -g firebase-tools`

4. Go to your website directory with:

    `$ cd`

5. Run your app:

    `$ firebase init`

6. Enter your Firebase email and password. Then enter your app name.

7. Deploy your app:

    `$ firebase deploy`

8. Go to Login & Auth page on Firebase Dashboard. Then click the box near of Enable Email & Password Authentication.

9. Copy everything inside of [rules.json](/rules.json) file to Security & Rules page. That's all.

###License

The MIT License (MIT)
