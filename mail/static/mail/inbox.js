document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = () => send_email();
  // By default, load the inbox
  load_mailbox('inbox');

  //Adding EventListener on all emails
  document.querySelector("#emails-view").addEventListener('click', e => {
      const id = e.target.dataset.id
      view_email(id)
  })

  document.querySelector("#one-email").addEventListener('click', e => {
    if (e.target.id === 'reply-button'){
      send_reply(e.target.dataset.email_id)
    }
    
    else if (e.target.id === 'archive-button'){
        archive(e.target.dataset.email_id,e.target.dataset.flag)
    }
  });

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#one-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  console.log(mailbox)
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#one-email').style.display = 'none';
  
  //Empty Out any previous emails
  document.querySelector("#emails-view").innerHTML = '';

  //GET Request
  
  fetch(`/emails/${mailbox}`)
  .then (response => response.json())
  .then (emails => {
      console.log(emails);
      emails.forEach(item => {
        const email = document.createElement('div')
        email.className = "email-block"
        email.dataset.id = item.id;
        email.style.borderWidth = "1px"
        email.style.borderStyle = "solid"
        email.style.borderColor = "black"

        if(item.read === true) {
          email.style.backgroundColor = "#c5c7c5"
        }

        //Sender for Email
        const sender = document.createElement('div')
        sender.className = "email"
        sender.className = "sender"
        sender.innerHTML = item.sender
        sender.style.display = 'inline-block'
        sender.style.margin = "15px"
        sender.style.float = "left"
        sender.dataset.id = item.id;


        //Subject for Email
        const subject = document.createElement('div')
        subject.className = "email"
        subject.className = "subject"
        subject.innerHTML = item.subject
        subject.style.display = 'inline-block'
        subject.style.margin = "15px"
        subject.style.paddingLeft = "40px"
        subject.dataset.id = item.id;


        //Timestamp
        const timestamp = document.createElement('div')
        timestamp.className = "email"
        timestamp.className = "timestamp"
        timestamp.innerHTML = item.timestamp
        timestamp.style.display = 'inline-block'
        timestamp.style.margin = "15px"
        timestamp.style.float = "right"
        timestamp.style.paddingRight = "40px"
        timestamp.dataset.id = item.id;

        //Appending All elements in Email div
        email.append(sender)
        email.append(subject)
        email.append(timestamp)

        document.querySelector("#emails-view").appendChild(email)
      });
  });

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  console.log('done loading mailbox')

};

//Sending Email
function send_email () {
  
  const recipients = document.querySelector('#compose-recipients').value;
  const subject  = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;  

  //Making a POST Request
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      if (result.message === "Email sent successfully.") {
        load_mailbox('sent')
      }
  });
  return false;
}

function view_email(id) {
  
  // Show one email div
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#one-email').style.display = 'block';

  //Making Sure #one-email is empty
  document.querySelector("#one-email").innerHTML = '';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);
    
    const from = document.createElement('div')
    from.innerHTML = `<strong>From: </strong>${email.sender}`
    document.querySelector('#one-email').appendChild(from)

    const to = document.createElement('div')
    to.innerHTML = `<strong>To: </strong>${email.recipients}`
    document.querySelector('#one-email').appendChild(to)

    const subject = document.createElement('div')
    subject.innerHTML = `<strong>Subject: </strong>${email.subject}`
    document.querySelector('#one-email').appendChild(subject)

    const timestamp = document.createElement('div')
    timestamp.innerHTML = `<strong>Timestamp: </strong>${email.timestamp}`
    document.querySelector('#one-email').appendChild(timestamp)

    const archive = document.createElement('button')
    if (email.archived === false) {
      archive.innerHTML = 'Archive'
      archive.dataset.flag = true
    }
    else {
      archive.innerHTML = 'Unarchive'
      archive.dataset.flag = false

    } 
    archive.id = "archive-button"
    archive.dataset.email_id = id
    archive.className = 'btn btn-primary'
    archive.style.float = 'right';
    document.querySelector('#one-email').appendChild(archive)    

    const hr = document.createElement('hr')
    document.querySelector('#one-email').appendChild(hr)

    const body = document.createElement('div')
    body.innerHTML = email.body
    body.style.paddingBottom = '15px'
    document.querySelector('#one-email').appendChild(body)

    const reply = document.createElement('button')
    reply.innerHTML = 'Reply'
    reply.id = "reply-button"
    reply.dataset.email_id = id
    reply.className = 'btn btn-dark'
    document.querySelector('#one-email').appendChild(reply)

  });

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

};

function send_reply(id) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#one-email').style.display = 'none';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
  document.querySelector("#compose-recipients").value = email.sender;

  //Check if subject line already starts with Re
  if (email.subject.substring(0,3)!="Re:"){
    document.querySelector("#compose-subject").value = `Re: ${email.subject}`;
  }
  else {
    document.querySelector("#compose-subject").value = email.subject;
  }
  
  document.querySelector("#compose-body").value = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}\n\n`;
});
};

function archive(id, flag) {
  const new_flag = flag.charAt(0).toUpperCase() + flag.slice(1);
  //Do Something
  function change_archive_status () {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: new_flag
      })
    })
    .then(response => {
      return console.log(response);
    })
  }
  change_archive_status();
  load_mailbox('inbox')
};



