# New Horizons

New Horizons is link aggregation application. It is a AngularJS codebase and uses Firebase for the database. You can easily install your server and you can create your own community whatever subject you want.

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

###Firebase Rules

Check `rules.json` file.
