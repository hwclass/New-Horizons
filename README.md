# New Horizons

New Horizons is link aggregation application. It is a AngularJS codebase and uses Firebase for the database. You can easily install your server and you can create your own community whatever subject you want.

Note: I am not professional coder. I am still studying on Javascript, AngularJs and Firebase. There may some bugs, error etc. If you find bug, or you have great idea for this application please create an issue. I improve this application every day.

###Features
* Membership system (of course)
* Point system (Every user can give a point to post or comment)
* Users can delete own posts and comments
* Most popular system (It depends on Hacker News algorithm, you can see in below)
* Admin can delete all posts and comments

###Upcoming Features
* Admin panel
* Karma
* Profile page
* Advanced category system (users can create new category)
* Moderator system
* Report system
* Fastening feature (Admin can fasten some posts)
* Message system (Users can send message each other)

###Why I choose this name?

In fact, New Horizons is a spacecraft and its mission to take picture of Pluto, studying on Pluto system and Kuiper Belt . When I was coding this project, New Horizons arrived Pluto and take it's picture. Then I thought, this application's mission is almost similar with New Horizons. New Horizons discover something new for humanity. With this application you can discover something new for yourself on the internet.

###Why I created this application?

I think, link aggregation is very important for the internet. There are very useful websites and contents on the internet but most people doesn't know these. With this application, everybody can discover the internet easily. There are websites like Hacker News, Reddit etc. But some group of people may want to create a community like these and I'd like to help them with this application.

###Installation

###Firebase Rules
```
{
    "rules": {
        "posts": {
          ".read": true,

          "$post_id": {
            ".write": "auth != null",

            ".validate": "newData.hasChildren(['categories', 'date', 'lastPoint', 'link', 'linkBase', 'numberOfComment', 'numberOfPoint', 'title', 'user', 'userId'])",

            "categories": {
              "science": {
                ".validate": "newData.val() === true || newData.val() === false"
              },

              "technology": {
                ".validate": "newData.val() === true || newData.val() === false"
              }
            },

            "date": {
              ".validate": "newData.val() <= now"
            },

            "lastPoint": {
              ".validate": "newData.isNumber()"
            },

            "link": {
              ".validate": "newData.isString() && (newData.val().contains('http://') || newData.val().contains('https://'))"
            },

            "linkBase": {
              ".validate": "newData.isString() && newData.val().length < 30"
            },

            "numberOfComment":{
              ".validate": "newData.isNumber() && newData.val() < 500"
            },

            "numberOfPoint":{
              ".validate": "newData.isNumber() && newData.val() < 1000"
            },

            "title": {
              ".validate": "newData.isString() && newData.val().length < 78"
            },

            "user": {
              ".validate": "newData.isString() && root.child('profile/' + auth.uid + '/name').val() == newData.val()"
            },

            "userId":{
              ".validate": "auth.uid === newData.val() && root.child('profile/' + newData.val()).exists()"
            }

          }

        },

        "comments": {
          ".read": true,

          "$post_id": {
            ".validate": "root.child('posts/' + $post_id).exists()",

            "$comment_id": {
              ".write": "(auth != null && !data.exists()) || (auth.uid === data.child('userId').val())",

              "commentsPoint": {
                ".validate": "!data.exists()",

                "$uid": {
                  "date": {
                    ".validate": "newData.val() <= now"
                  },
                  "user": {
                    ".validate": "root.child('profile/' + auth.uid + '/name').val() == newData.val()"
                  }
                }
              },

              "date": {
                ".validate": "newData.val() <= now"
              },

              "numberOfPoint": {
                ".validate": "newData.isNumber() && newData.val() < 1000"
              },

              "text": {
                ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 2000"
              },

              "user": {
                ".validate": "root.child('profile/' + auth.uid + '/name').val() == newData.val()"
              },

              "userId": {
                ".validate": "root.child('profile/' + newData.val()).exists()"
              }
            }

          }
        },

        "points": {
          ".read": true,

          "$post_id": {
            ".validate": "root.child('posts/' + $post_id).exists()",

            ".write": "auth != null && !data.exists()",

            "$uid": {
              ".validate": "root.child('profile/' + auth.uid).exists()",

              "date": {
                ".validate": "newData.val() <= now"
              },

              "user": {
                 ".validate": "root.child('profile/' + auth.uid + '/name').val() == newData.val()"
              }
            }
          }

        },

        "profile": {
          ".read": true,

          "$uid": {
            ".write": "!data.exists() && auth.uid === $uid"
          }  
        },

        "$other": { ".validate": false }
    }
}
```
