let createItem = document.getElementById("create-form")
let createField = document.getElementById("create-field")
let listItem  = document.getElementById('item-list')


function itemTemplate(item) {
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
            <button data-id= ${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id= ${item._id} class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
    </li>
    `
}

// initial page loader
let ourHTML = items.map(function(item) {
    return itemTemplate(item)
}).join('')

listItem.insertAdjacentHTML('beforeend', ourHTML)


// Create item

createItem.addEventListener('submit', function(ev) {
    ev.preventDefault()
    axios.post("/create-item", {text: createField.value}).then(function(response) {
        listItem.insertAdjacentHTML('beforeend', itemTemplate(response.data))
    }).catch(
        console.log("There was an error")
    )
    createField.value = ''
    createField.focus()
})


// Update item
document.addEventListener('click', function(ev) {
    if(ev.target.classList.contains('edit-me')) {
        let userInput = prompt('Change item', ev.target.parentElement.parentElement.querySelector('.item-text').innerHTML)
        let id = ev.target.getAttribute('data-id')
        if(userInput) {
            axios.post('/update-item', {id: id, text: userInput}).then(
                ev.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput
            ).catch(
                console.log('There was an error')
            )
        }
    }
})


// Delete item
document.addEventListener('click', function(ev) {
    if(ev.target.classList.contains('delete-me')) {
        if(confirm("Do you want to delete this item permanently")) {
            let id = ev.target.getAttribute('data-id')
            axios.post('/delete-item', {id: id}).then(
                ev.target.parentElement.parentElement.remove()
            ).catch(
                console.log('There was an error')
            )
        }
        
    }
})