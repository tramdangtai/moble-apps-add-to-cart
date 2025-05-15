// Chỗ này import function từ ngoài vào. Nên cần dùng Import
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js" 

// Tạo biến lưu trữ url database (này lấy từ firedatabase)
const appSettings = {
    databaseURL: "https://mobie-app-project-default-rtdb.asia-southeast1.firebasedatabase.app/"
}


const app = initializeApp(appSettings)          // Khởi tạo ứng dụng
const database = getDatabase(app)               // truy cập vào database của firedatabase
const shoppingListInBD = ref(database, "shoppingList")      // tham khảo, đường truyền. Là từ database, đi vào folder "shoppingList"

// lấy phần tử từ HTML
const inputFieldEl = document.getElementById("input-field")     
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Tạo function clear bất kỳ thứ gì trong chỗ input nhập vào.
function clearInputFieldEl() {
    // clear whatever user input when they click button.
    inputFieldEl.value = ""
}

// remove: là funtion nhập từ ngoài vào. Dùng để xóa 1 phần tử trong database khi biết rõ path của nó.
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    // append item in li item in HTML file
    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}

// Clear các phần tử li trước khi lấy data từ database, 1 database show ra nhiều lần.
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}


addButtonEl.addEventListener("click", function() {
    // get value to work
    let inputValue = inputFieldEl.value
    // push data to database
    push(shoppingListInBD, inputValue)

    clearInputFieldEl()
})


onValue(shoppingListInBD, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]

            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No item here... yet"
    }

    
})