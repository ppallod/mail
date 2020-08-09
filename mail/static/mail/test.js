function load_mailbox(mailbox) {
    console.log(mailbox)
    
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';

    //GET Request
    fetch(`/emails/${mailbox}`)
    .then (response => response.json())
    .then (emails => {
        console.log(emails)
    })
    
    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  }
  