
// var totalNoOfResrouces = window.performance.getEntriesByType("resource").length;
// console.log(totalNoOfResrouces)
var valueSearch = localStorage.getItem('valueSearch')
$('#search').value = valueSearch
console.log(valueSearch)

function getCategory() {
    let datacategory = fetch('http://www.sports.somee.com/api/category')
        .then(response => response.json())
    return datacategory
}


function filterArticleByName(artilceList, value) {
    if (value == null || value == undefined) return false
    else {
        artilceList = artilceList.filter(params => {
            return params.nameArticle.toLowerCase().indexOf(value.toLowerCase()) != -1;
        })
        return artilceList
    }

}

; (async function start() {
    let dataArticle = await getArticle()
    dataArticle = filterArticleByName(dataArticle, valueSearch)
    renderArticle(dataArticle)
    renderTopView(dataArticle)
})()

function getArticle() {
    let data = fetch(`http://www.sports.somee.com/api/Articles`)
        .then(function (res) {
            return res.json()
        })
        .then(res => {
            if (!(res.result == undefined)) PromiseRejectionEvent
            else return res
        })
    return data
}


function renderArticle(artilceList) {
    // sort để sắp xếp thời gian in ra sớm nhất in ra trước

    artilceList = artilceList.sort(function (a, b) {
        return new Date(b.datetime_article) - new Date(a.datetime_article);
    });
    console.log(artilceList)
    // reverse vì khi sắp xếp xong thì sẽ ngày xa nhất lên đầu nên reverse để ngày gần nhất ở đầu để hiện trước
    // artilceList = artilceList.reverse()
    var listArticle = artilceList.map(value => {
        return `<a href="http://127.0.0.1:5500/layout/detailArticle.html?id_article=${value.id_article}" class ="link-article">
        <div class="article-item">
        <div class="item__img">
            <img src="${value.img}" alt="anh"
                class="item__img-source">
        </div>
        <div class="item__content">
            <h3 class="content__title">${value.nameArticle}</h3>
            <small class="item-meta">
                <span class="item-meta-item">
                    <i class="far fa-clock"></i>
                    ${formatDate(value.datetime_article)}
                </span>
                <span class="item-meta-item">${value.name_category}</span>
            </small>
            <div class="decription-article">${value.desciption}</div>
        </div>
    </div>
        </a>
    <hr class="a">`
    })

    // var element_listArticle = 
    document.querySelector('.article-list').innerHTML = listArticle.join('')
    var header_search = document.createElement('div')
    header_search.classList.add('header__category')
    header_search.innerHTML = `<div class="icon-header-retangle-category"></div>
    <span>Trang chủ >> Tìm kiếm</span>`

    var displayNumberResult = document.createElement('div')
    displayNumberResult.classList.add('number-result')
    displayNumberResult.innerHTML = `Có <b>${artilceList.length}</b> kết quả tìm kiếm với từ khóa "<b>${valueSearch}</b>"`
    document.querySelector('.article-list').prepend(displayNumberResult)

    document.querySelector('.article-list').prepend(header_search)
}

function formatDate(dateStr) {
    var d = new Date(dateStr)
    return d.toString().substring(0, 24)
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

