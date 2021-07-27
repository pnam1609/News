

//var id_article = 16
// var url_string = "http://127.0.0.1:5500/layout/detailArticle.html?id_category=16"; //window.location.href
var url = new URL(window.location.href);
var id_article = url.searchParams.get("id_article");
if (id_article == null) {
    header('HTTP/1.0 404 Not Found')
}

var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)
//format ra thời gian cần hiển thị
function fommatTime(dateStr) {
    var d = new Date(dateStr)
    return d.toString().substring(0,24)
}


//khi dư nhiều dấu \n thì split ra array chứa nhiều phần tử của mảng rổng nên hàm này để loại bỏ nó
function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}
function getListArticle(id_category) {
    let data = fetch(`http://www.sports.somee.com/api/Articles?id_category=${id_category}`)
        .then(function (res) {
            return res.json()
        })
        .then(res => {
            if (!(res.result == undefined)) PromiseRejectionEvent
            else return res
        })
    return data
}

//hàm start để thực hiện render ra ca bài báo
async function start() {
    var article = await getArticle()
    var listArticle = await getListArticle(article.category.id_category)
    console.log(listArticle)

    // hàm này khi chạy 1 lần là tăng view 1 lần
    var increaseView = (function() {
        var executed = false;
         return function() {
            if (!executed) {
                executed = true;
                article.views += 1
                console.log(article.views)
                article.id_category = article.category.id_category
                var option = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify(article)
                }
                //Call Api
                async function postData(url = '') {
                    const response = await fetch(url, option);
                    return response.json();
                }

                postData('http://www.sports.somee.com/api/Articles')
                    .then(dataRes =>{
                        console.log(dataRes)
                    })
            }
        };
    })(article);
    renderTopView(listArticle)
    increaseView(article)
    renderArticle(article)
    postComment()

}

start()


function getArticle() {
    let data = fetch(`http://www.sports.somee.com/api/Articles/${id_article}`)
        .then(res => {
            return res.json()
        })
        .then(res =>{
            if(!(res.result == undefined)) PromiseRejectionEvent
            else return res
        })

    return data
}

//truy xuất ra dữ liệu từ đường link api

//render ra view của article
function renderArticle(articleDetail) {
    //console.log(articleDetail)
    //lấy ra element chứa tất cả chi tiết bài báo
    //console.log(articleDetail.comments)

    var container_article = document.querySelector('.container-article')

    //render category 
    container_article.appendChild(createCategory(articleDetail))

    var article = document.createElement('div')
    article.classList.add('article')

    //append header vào article
    article.appendChild(createHeader(articleDetail))

    //từ article append vào container chứa cả bài báo
    // container_article.appendChild(article)

    article.appendChild(document.createElement('hr'))

    //append content vào article
    article.appendChild(createContentArticle(articleDetail))

    //từ article append vào container chứa cả bài báo
    container_article.appendChild(article)

    container_article.appendChild(createListComment(articleDetail))





}

async function postComment() {

    //================ Post Comment=======================
    var button = document.querySelector('.submit')
    var text = document.querySelector('#value-comment')
    var localStorageUser = localStorage.getItem('dataUser')
    localStorageUser = JSON.parse(localStorageUser)

    var localStorageAdmin = localStorage.getItem('admin')
    localStorageAdmin = JSON.parse(localStorageAdmin)
    //console.log(localStorageData)

    if (button != null) {
        button.onclick = async () => {
            console.log(111111111111111)
            if (localStorageUser == null && localStorageAdmin == null) {

                localStorage.setItem('currentLink', location.href);
                location.href = "http://127.0.0.1:5500/layout/login.html"

            }
            if (text.value != null) {
                // console.log(datastring)
                //var datastring = text.value.replace(new RegExp('\r?\n', 'g'), '|')
                if (localStorageUser != null) {
                    var dataCommentPost = {
                        comment_content: text.value,
                        name: localStorageUser.name,
                        id_user: localStorageUser.id_user,
                        id_article: id_article
                    }
                } else {
                    var dataCommentPost = {
                        comment_content: text.value,
                        name: localStorageAdmin.name,
                        id_user: localStorageAdmin.id_user,
                        id_article: id_article
                    }
                }

                console.log(dataCommentPost)
                var option = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify(dataCommentPost)
                }

                //Call Api
                async function postData(url = '') {
                    const response = await fetch(url, option);
                    return response.json();
                }

                postData('http://www.sports.somee.com/api/Comment')// , dataCommentPost xóa ở bên cạnh nhưng chưa check
                    .then(data => {

                        // thêm comment trực tiếp vào giao diện
                        // $('.content-comment').prepend(createComment(dataCommentPost.name,dataCommentPost.comment_content))  

                        // $('#value-comment').value =''
                        $('.content-comment').prepend(createComment(dataCommentPost.name, dataCommentPost.comment_content))

               
                        document.querySelector('#value-comment').value = ""

                    });
                
            }
        }
    }
}



function createCategory(articleDetail) {
    var categoryElement = document.createElement('div')
    categoryElement.classList.add('category')
    categoryElement.innerHTML = ` <i class="fas fa-indent category__item"></i>`
    var spanCategoryElement = document.createElement('span')
    spanCategoryElement.classList.add('category__item')
    spanCategoryElement.innerHTML = articleDetail.category.name_category
   

    categoryElement.appendChild(spanCategoryElement)
    return categoryElement
}


function createHeader(articleDetail) {

    var headerTitile = document.createElement('div')
    headerTitile.classList.add('header-title')
    // format String datetime của sql sang chuỗi cần hiện ra
    var formatTime = fommatTime(articleDetail.datetime_article)
    //console.log(formatTime)
    var headerTitile_detail =
        `<div class="header-title__item bold-title">${articleDetail.nameArticle}</div>
<div class="header-title__item faint">
<div class="author">

    <i class="fas fa-user author__item mgr-20 large-icon"></i>
    <span class="author__item">${articleDetail.author}</span>
</div>
<div class="time-article">
    <i class="far fa-clock time mgr-5"></i>
    <span class="time">${formatTime}</span>
</div>
</div>`;

    headerTitile.innerHTML = headerTitile_detail

    return headerTitile
}


function createContentArticle(articleDetail) {
    var contentTitleElement = document.createElement('div')
    contentTitleElement.classList.add('content-title')
    contentTitleElement.innerHTML =
        `<div class="desciption">${articleDetail.desciption}</div>
<div class="content__img">
    <img src="${articleDetail.img}" alt="" class="img-article">
</div>`
    //contentTitleElement.appendChild(document.createElement('hr'))

    var paragraph = articleDetail.contentArticle


    var array = paragraph.split('|')

    array = removeItemAll(array, "")

    var paragraphElement = array.map(element => {
        return `<p class="content__item">${element}</p>`
    })
    var contentElement = document.createElement('div')
    contentElement.classList.add('content')
    contentElement.innerHTML = paragraphElement.join("")

    contentTitleElement.appendChild(contentElement)

    return contentTitleElement
}

function createListComment(articleDetail) {
    var commentElement = document.createElement('div')
    commentElement.classList.add('comment')

    commentElement.innerHTML =
        `<div class="comment-part">
            <textarea rows="4" class="box-comment" id="value-comment"></textarea>
            <button class="submit">Bình Luận</button>
        </div>`;


    var commentPart = document.createElement('div')
    commentPart.classList.add('comment-part')
    commentPart.innerHTML = `<lable class="for-comment">Bình Luận</lable>`


    // thẻ để chứa các comment load ra từ biến
    var contentComment = document.createElement('div')
    contentComment.classList.add('content-comment')

    // biến sẽ lưu list comment để load ra cần reverse để đảo ngược mục đích hiện thị theo thời gian comment sau thì hiện lên trước
    var listComment = articleDetail.comments.reverse();
    var commentsElement = listComment.map(value => {

        return `<div class="container__comment">
        <div class="content-comment__item">
            <img src="/assets/img/Avatar.jpg" alt="" class="avatar">
        </div>
        <div class="content-comment__item box-content-comment">
            <div class="name-user-comment">${value.user.name}</div>
            <div class="detail-comment">${value.comment_content}</div>
        </div>
    </div> `
    })

    //sau khi da đưa được ra thẻ thì sẽ đưa ra element part để sau đó gắn vào thẻ comment
    contentComment.innerHTML = commentsElement.join('')

    commentPart.appendChild(contentComment)

    commentElement.appendChild(commentPart)

    return commentElement
}


function createComment(nameUser, content_comment) {
    return `<div class="container__comment">
        <div class="content-comment__item">
            <img src="/assets/img/Avatar.jpg" alt="" class="avatar">
        </div>
        <div class="content-comment__item box-content-comment">
            <div class="name-user-comment">${nameUser}</div>
            <div class="detail-comment">${content_comment}</div>
        </div>
    </div>`
}

function renderTopView(artilceList) {
    var list_article_topView = document.querySelector('.list-article-topView')
    artilceList = artilceList.sort((b, a) => {
        return a.views - b.views
    })
    var i = 0
    var topViewElement = artilceList.map(value => {
        i++

        if (i < 6) {
            return `<a class="link-article" href="http://127.0.0.1:5500/layout/detailArticle.html?id_article=${value.id_article}">
        <div class="side-article__item">
            <div class="img__side-item">
                <img src="${value.img}" alt="">
            </div>
            <div class="title__side-item">${value.nameArticle}</div>
        </div>
    </a>`
        }
    })

    list_article_topView.innerHTML = topViewElement.join('')
}



