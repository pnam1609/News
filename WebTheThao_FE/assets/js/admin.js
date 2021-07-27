const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


var urlArticle = 'http://www.sports.somee.com/api/Articles'
var urlCategory = 'http://www.sports.somee.com/api/Category'
var urlArticleById = 'http://www.sports.somee.com/api/Articles/'


// là biến chứa danh sách các danh muc



function getListCategory() {
    let data = fetch("http://www.sports.somee.com/api/Category")
        .then(function (res) {
            return res.json()
        })
        .then(data => {
            return data
        })
    return data
}




//================================ Các hàm để hiện lấy dữ liệu danh mục cho phần thêm sửa danh mục

// vì display ban đầu là none nên dùng hàm này để hiện lên lại
function displayContenDrop() {
    var listCategoryElement = document.querySelectorAll('.dropdown-content')

    listCategoryElement.forEach(element => {
        if (element.style.display == 'block') {
            element.style.display = 'none'

        } else {
            element.style.display = 'block'
        }
    });
}

//lấy dữ liệu từ dropdown để hiện thị ra ngoài
function getCategoryFromDropdown(id) {
    getListCategory()
        .then(data => {
            var container_content_category = document.querySelectorAll(".display__category")
            container_content_category.forEach(element => {
                var category_display = data.find((value) => {
                    if (value.id_category == id) return value
                })
                element.innerHTML = category_display.name_category
                // localStorage.removeItem('id_category_dropDown')
                // localStorage.setItem('id_category_dropDown', category_display.id_category)
            });
        })
}


//hàm này render xong nhưng chưa hiển thi ra vì để display = none
function renderListCategory() {
    getListCategory()
        .then(data => {
            var listCategoryElement = document.querySelectorAll('.dropdown-content')

            var list_cate = data.map(value => {
                return `<div class="dropdown__item" onclick="getCategoryFromDropdown(${value.id_category})">${value.name_category}</div>`
            })
            listCategoryElement.forEach(element => {
                element.innerHTML = list_cate.join('')
            });
        })
}




//========================  Lấy element và set click để chuyển sang trang khác
var articleElement = document.querySelector('.article')
var categoryElement = document.querySelector('.category-item')
var userElement = document.querySelector('.user')
var adminElement = $('.admin')



//hàm này để chỉ run 1 lần
var something = (function () {
    var executed = false;
    return async function () {
        if (!executed) {
            executed = true;
            var article_list = await getArticle()
            renderArticle(article_list)
            //getArticle(renderArticle)
            getCategory(renderCategory)
        }
    };
})();
something()

// khi click vào phần bài báo để quản lí
articleElement.onclick = () => {

    //ẩn những phần đang hiện và add class active để hiện lại cái cần
    $('.active_admin').classList.remove('active_admin')
    $('.display__get__article').classList.add('active_admin')

}

// khi click vào phần danh mục để quản lí
categoryElement.onclick = () => {
    $('.active_admin').classList.remove('active_admin')
    $('.display__get__category').classList.add('active_admin')
}

//=========================== render article ==================================
// function getArticle(callback) {

//     fetch(urlArticle)
//         .then(function (res) {
//             return res.json()
//         })
//         .then(callback)
// }
function getArticle() {

    let data = fetch(urlArticle)
        .then(function (res) {
            return res.json()
        })
    return data
}


$('.btn-primary').onclick = async () => {
    var artilceList = await getArticle()
    var searchValue = $('#search').value
    if (searchValue == null || searchValue == undefined || searchValue == '') {
        var lengthArticlePrev = localStorage.getItem('lengthArticlePrev')
        if (lengthArticlePrev != null && lengthArticlePrev != artilceList.length) {
            localStorage.setItem('lengthArticlePrev', artilceList.length)
            renderArticle(artilceList)
        }
    }
    else {
        var list_article_to_render = filterArticleByName(artilceList, searchValue)
        localStorage.setItem('lengthArticlePrev', list_article_to_render.length)
        if (list_article_to_render == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Không có tên danh mục hay tên bài báo có từ khóa: ${searchValue}`,

            })
            // alert(`Không có bài báo có từ khóa hay tên danh mục: ${searchValue}`)
        }
        else {
            renderArticle(list_article_to_render)
        }

    }

}

function renderArticle(artilceList) {



    // var manageElement = document.createElement('div')
    // manageElement.classList.add('manage')

    // //class này lấy hiển thị list khi được click vào
    // manageElement.classList.add('display__get__article')
    // manageElement.classList.add('active_admin')

    // manageElement.innerHTML = `
    // <div class="form-group" style="flex-direction: row;">
    // <div class="search-group">
    //                     <input id="search" name="search" type="text" placeholder="Nhập từ khóa..." class="form-control">
    //                     <span class="input-group-btn">
    //                         <button class="btn btn-primary" type="button">
    //                             <span class="fa fa-search mr-5"></span>Tìm
    //                         </button>
    //                     </span>
    //                 </div>
    //                     <button class="dropdown-list_category">Thể loại<i class="fas fa-chevron-down ml-15"></i></button>
    //                 </div>
    // <div class="create" onclick="createArticle()">Create</div>
    // `

    // var manage__item = document.createElement('div')
    // manage__item.classList.add('manage__item')
    var manage__item = $('.list_article')


    //console.log(artilceList)
    //sort để sắp xếp theo thời gian
    artilceList = _.sortBy(artilceList, function (date) {
        return date.datetime
    })
    // reverse vì khi sắp xếp xong thì sẽ ngày xa nhất lên đầu nên reverse để ngày gần nhất ở đầu để hiện trước
    artilceList = artilceList.reverse()
    var listArticle = artilceList.map(value => {
        var date = new Date(value.datetime_article)
        var timeFormat = date.toString().substring(0, 24)
        //var timeFormat = fommatTime(value.datetime_article);
        return `<div class="article-item article_id--${value.id_article}">
        <div class="item__img">
            <img src="${value.img}" alt="anh"
                class="item__img-source">
        </div>
        <div class="item__content">
            <h3 class="content__title">${value.nameArticle}</h3>
            <small class="item-meta">
                <span class="item-meta-item">
                    <i class="far fa-clock"></i>
                    ${timeFormat}
                </span>
                <span class="item-meta-item">${value.name_category}</span>
            </small>
            <div class="decription-article">${value.desciption}</div>
        </div>
        <div class="edit">
        <div class="edit__item success"  onclick="editArticle(${value.id_article},${value.views})">Edit</div>
        <div class="edit__item error"  onclick="deleteArticle(${value.id_article})">Delete</div>
    </div>
    </div>
    `
    });

    // var element_listArticle = 
    //manageElement.innerHTML = listArticle.join('')

    manage__item.innerHTML = listArticle.join('')
    // var manageAfterCreateArticle = $('.display__get__article')

    // // Xử lí 2 trường hợp:
    // //TH1 : thêm mới khi chưa có gì thì thêm append thêm vô admin
    // //TH2:  Lúc bấm button create Article (lúc đó đã append vô trước đã có rồi nên check lại k sẽ append dư)
    // if (manageAfterCreateArticle != null) {
    //     manageAfterCreateArticle.innerHTML = `<div class="create" onclick="createArticle()">Create</div>`
    //     manageAfterCreateArticle.appendChild(manage__item)

    //     return
    // }


    //manageElement.appendChild(manage__item)
    //adminElement.appendChild(manageElement)


}

function filterArticleByName(artilceList, value) {
    if (value == null || value == undefined) return false
    else {
        artilceList = artilceList.filter(params => {
            return params.nameArticle.toLowerCase().indexOf(value.toLowerCase()) != -1 || params.name_category.toLowerCase().indexOf(value.toLowerCase()) != -1;
        })
        return artilceList
    }

}

//========================== Create Article =============================
function createArticle() {
    $('.form-notify').innerHTML = ""
    $('.notify-edit').innerHTML = ""

    $('.active_admin').classList.remove('active_admin')
    $('.display__create__article').classList.add('active_admin')

    getListCategory()
        .then(data => {

            var date = new Date()


            //khi tạo mới xóa hết dữ liệu trong form
            $('#nameArticle').value = ""
            $('#author').value = ""
            $('#display__category').innerHTML = data[0].name_category
            console.log(data[0].name_category)
            $('#img').value = ""
            $('#datetime_article').innerHTML = date.toString().substring(0, 24)
            $('#contentArticle').value = ""
            $('#desciption').value = ""

            renderListCategory()

            getTimePicker()
        })

}

//========================== Edit Article =============================
function changeImgEdit(value) {
    console.log(value)
    if (value == undefined || value == "" || value == null) return true
    else return false
}

function editArticle(id) {

    $('.form-notify').innerHTML = ""
    $('.notify-edit').innerHTML = ""

    $('.active_admin').classList.remove('active_admin')
    $('.display__edit__article').classList.add('active_admin')
    fetch(urlArticleById + id)
        .then(res => {
            return res.json();
        })
        .then(data => {

            console.log(data.img)
            // xử lí trước khi in ra
            var content = data.contentArticle.replaceAll('|', '\n')

            var date = new Date(data.datetime_article)
            var timeFormat = date.toString().substring(0, 24)
            $("#id_article").value = data.id_article
            $('#nameArticle1').value = data.nameArticle
            $('#author1').value = data.author
            $('#display__category1').innerHTML = data.category.name_category
            $('#img1').src = data.img

            $('#datetime_article1').innerHTML = timeFormat
            $('#contentArticle1').value = content
            $('#desciption1').value = data.desciption


            // tạo ra local id_article để khi onsubmit để edit có thể lấy ra id để bỏ vào data để sửa
            //localStorage.setItem('id_Article_edit', data.category.id_category)
        })


    renderListCategory()

    getTimePicker1()
}

//========================= Delete Article ============================

function deleteArticle(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'Your article has been deleted.',
                'success'
            )
            var option = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
            //Call Api
            async function postData(url = '') {
                const response = await fetch(url, option);
                return response.json();
            }

            postData(urlArticle + "/" + id)
                .then(dataRes => {
                    console.log(dataRes)
                    document.querySelector(`.article_id--${id}`).remove();
                });
        }
    })


}

//============================== Category ================================
function getCategory(callback) {
    fetch(urlCategory)
        .then(res => {
            return res.json()
        })
        .then(callback)
}

//function renderCategory(categoryData) {
function renderCategory(list_category) {

    var manageElement = document.createElement('div')
    manageElement.classList.add('manage')
    manageElement.classList.add('display__get__category')

    manageElement.innerHTML = `<div class="create" onclick="createCategory()">Create</div>`
    //console.log(manageElement)

    var manage__item = document.createElement('div')
    manage__item.classList.add('manage__item')

    //tạo header cho bảng vì nếu nếu để các thẻ <th> ở trong table để thẻ table.inerhtml 
    //                                                                          thì các <td> không thể appendchild được nên tạo riêng ở ngoài
    var headerTableElement = document.createElement('div')
    headerTableElement.classList.add("header-table")
    headerTableElement.innerHTML = `<div class="header-table__item stt">ID</div>
    <div class="header-table__item name__header-table__item">Name category</div>
    <div class="header-table__item name__process__header">Process</div>`

    var hr_header_element = document.createElement('hr')

    //var tableElement = document.querySelector('.table__category')
    var table__categoryElement = document.createElement('table')
    table__categoryElement.classList.add('table__category')
    //tableElement.innerHTML = `<tr class="tr-table"><th>STT</th><th>Name category</th></tr>`

    var listCategoryElement = list_category.map(value => {
        return `<tr class = "category_id--${value.id_category}">
        <td>${value.id_category}</td>
        <td>${value.name_category}</td>
        <td class="edit-category__item" onclick="editCateory(${value.id_category})">Edit</td>
        <td class="delete-category__item" onclick="deleteCateory(${value.id_category})">Delete</td>
    </tr>`
    })
    //<td class="edit-category__item" onclick="editCateory(${value.id_category})">Edit</td>
    table__categoryElement.innerHTML = listCategoryElement.join('')


    manage__item.appendChild(headerTableElement)
    manage__item.appendChild(hr_header_element)
    manage__item.appendChild(table__categoryElement)

    var manageAfterCreateCategory = $('.display__get__category')

    // Xử lí 2 trường hợp:
    //TH1 : thêm mới khi chưa có gì thì thêm append thêm vô admin
    //TH2:  Lúc bấm button create category(lúc đó đã append vô trước đã có rồi nên check lại k sẽ append dư)
    if (manageAfterCreateCategory != null) {
        manageAfterCreateCategory.innerHTML = `<div class="create" onclick="createCategory()">Create</div>`
        manageAfterCreateCategory.appendChild(manage__item)

        return
    }

    manageElement.appendChild(manage__item)
    adminElement.appendChild(manageElement)
}

//======================== Create Category =================
function createCategory() {

    $('.active_admin').classList.remove('active_admin')
    $('.display__create__category').classList.add('active_admin')

    $('#name_category').value = ''


}

//======================== Edit Category ===================
function editCateory(id) {

    $('.active_admin').classList.remove('active_admin')
    $('.display__edit__category').classList.add('active_admin')


    getListCategory()
        .then(data => {
            var datafilter = data.filter(element => {
                if (element.id_category == id) return element
            })
            return datafilter
        })
        .then(nameCategory => {
            $('#name_category_edit_category').value = nameCategory[0].name_category
            $('#id_category_edit_category').value = nameCategory[0].id_category
        })
}

//======================== Delete Category ===================
function deleteCateory(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'Your category has been deleted.',
                'success'
            )
            var option = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
            //Call Api
            async function postData(url = '') {
                const response = await fetch(url, option);
                return response.json();
            }

            postData(urlCategory + "/" + id)
                .then(dataRes => {
                    console.log(dataRes)
                    document.querySelector(`.category_id--${id}`).remove();
                });
        }
    })


}


//hàm để lấy dữ liệu từ sql format ra dạng string để dễ nhìn
// function fommatTime(dateStr) {
//     if (dateStr == null || dateStr == "") {
//         return "Không có ngày giờ"
//     }
//     var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     var d = new Date(dateStr)
//     var dayName = days[d.getDay()];
//     return `${dayName} ${monthNames[d.getMonth() + 1]} ${d.getDate()} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
// }






//hàm lấy thời gian khi tạo mới bài báo
function getTimePicker() {
    if ($('.simplepicker-wrapper') == null) {
        console.log("da co roi    ==========")
    }
    let simplepicker = new SimplePicker({
        zIndex: 10
    });
    var getTime
    //lấy ra element để hiển thị thời gian
    var datetime_article = document.querySelector('#datetime_article')
    //console.log(datetime_article)
    if (datetime_article != null) {
        //  khi click vào sẽ sẽ mở simple picker để chọn thời gian
        //console.log(datetime_article)
        datetime_article.onclick = () => {
            simplepicker.open();
        }
        simplepicker.on('submit', (date, readableDate) => {
            //getTime dang loi
            //getTime = readableDate
            //console.log(getTime)
            datetime_article.innerHTML = readableDate;
        });

    }
}

//hàm lấy thời gian khi edit bài báo
function getTimePicker1() {
    if ($('.simplepicker-wrapper') == null) {
        console.log("da co roi    ==========")
    }
    let simplepicker = new SimplePicker({
        zIndex: 10
    });
    // var getTime
    var datetime_article1 = document.querySelector('#datetime_article1')
    if (datetime_article1 != null) {
        //  khi click vào sẽ sẽ mở simple picker để chọn thời gian
        datetime_article1.onclick = () => {
            simplepicker.open();
        }
        simplepicker.on('submit', (date, readableDate) => {

            datetime_article1.innerHTML = readableDate;
        });

    }
}

//nút back lại của manage article
function getBackArticle() {

    Swal.fire({
        title: 'Do you want exit?',
        showCancelButton: true,
        confirmButtonText: `Exit`,
        // denyButtonText: `Don't save`,
    })
        .then((result) => {
            if (result.isConfirmed) {
                $('.active_admin').classList.remove('active_admin')
                $('.display__get__article').classList.add('active_admin')

                //Có thể khi ấn nút back lại thì dropdown của danh sách  danh mục chưa tắt 
                $$('.dropdown-content').forEach(element => {
                    element.style.display = 'none'
                })
            }
        })

}

function getBackCategory() {

    Swal.fire({
        title: 'Do you want exit?',
        showCancelButton: true,
        confirmButtonText: `Exit`
    })
        .then((result) => {
            if (result.isConfirmed) {
                $('.active_admin').classList.remove('active_admin')
                $('.display__get__category').classList.add('active_admin')
            }
        })
}





const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

