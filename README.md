Meteor Live Template Editor

Demo application which reads and writes CSS and dynamic Meteor Blaze Templates via the database and renders the changes live.

Stores Template code and CSS in the database. 

<a href="http://live-template-editor.meteor.com/" target="_blank">view the demo here</a>

![screenshot](https://cloud.githubusercontent.com/assets/1656829/6429594/ef9c5f50-bf91-11e4-80ca-3d4f6b45f177.png)


Use at own risk!  I think the way this is implemented really goes against the grain of Meteor constructs, but in some cases it might be useful as a meta sort of approach to Template coding.

Some Potential Practical Applications are :

-Education, where the user can try out spacebars syntax out as part of a tutorial about Blaze, Meteor and data context. 

-CMS, where the system allows site admins to customize the appearance of the app by editing the Template code for a given page, I know that Big Cartel and similar CMS systems expose this functionality to customize the appearance for online stores.

-in-app Template inspector, similar to a browser's html inspector.

