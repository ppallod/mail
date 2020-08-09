# Mail

Mail is a Web Application built using Django framework that lets users view, send and archive emails asynchronously using JavaScript. Its a single page application where the user always stay on the same page, but the content of the page is dynamically changed using JavaScript. 

#### Send Email
When a user submits the email composition form, JavaScript is used to actually send the email. A `POST` request is made to the route `/emails` by passing values for `recipients`, `subject`, and `body`. Once the email has been sent, the JS loads the user's sent mailbox. 

#### Mailbox
When a user visits their `Inbox`, `Sent mailbox`, or `Archive`, the appropriate mailbox is loaded by performing a `GET` request to the route `/emails/<mailbox>`. The content of the page is displayed in reverse chronological order such that the most recent emails are to the top. 

#### View Email
When a user clicks on an email, the user is taken to a view where they see the content of that email. In order to get the content of the email, a `GET` request is made to the route `/emails/<email_id>` where email_id is the id of that particular email. Each unread email in the mailbox has a white background color which is dynamically changed to grey once the user reads it. This is achieved by performing a `PUT` request to the route `/emails/<email_id>` and changing the `read` flag to `true` for that particular email. 

#### Archive and Unarchive
These buttons help user to archive or unarchive emails that they receive. In the inbox, user is presented with a button to archive an email while within the archive mailbox, they can unarchive an email. This is achieved by performing a `PUT` request to the route `/emails/<email_id>` by changing the `archived` flag.     

#### Reply
When viewing an email, the user is provided with a reply button that lets them reply to the emails. Clicking on this button, the user is taken to the email composition form which is pre-filled with `recipient` with whoever sent the original email. Moreover, the `subject` field is set to `RE:` followed by the subject from the original email. Finally, the body of the email is filled with the line `On Jan 1 2020, 12:00 AM foo@example.com wrote:` followed by the original text of the email.