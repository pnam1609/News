

function getArticle() {
    let dataArtticle = fetch('http://www.sports.somee.com/api/Articles')
        .then(response => response.json())
    return dataArtticle
}

function getCategory() {
    let datacategory = fetch('http://www.sports.somee.com/api/category')
        .then(response => response.json())
    return datacategory
}

function getArticleByCategory(id_category) {
    let datacategory = fetch(`http://www.sports.somee.com/api/Articles?id_category=${id_category}`)
        .then(response => response.json())
    return datacategory
}

async function start() {
    var data_article = await getArticle()
    var data_category = await getCategory()
    renderListArticleByCategory(data_category)
    renderArticle(data_article)

}
start()

function renderArticle(dataArtticle) {
    var i = 0
    dataArtticle = dataArtticle.sort(function (a, b) {
        return new Date(b.datetime_article) - new Date(a.datetime_article);
    });


    var articleElement = dataArtticle.map(value => {
        i++
        if (i < 20) {
            return `<a class="link-article" href="http://127.0.0.1:5500/layout/detailArticle.html?id_article=${value.id_article}"><div class="article-item">
        <div class="item__img">
            <img src="${value.img}" alt=""
                class="item__img-source">
        </div>
        <div class="item__content">
            <h3 class="content__title">${value.nameArticle}</h3>
            <small class="item-meta">
                <span class="item-meta-item">
                    <i class="far fa-clock"></i>
                    ${formattime(value.datetime_article)}</span>
                <span class="item-meta-item">${value.name_category}</span>
            </small>
        </div>
    </div></a>
    <hr class="a">`
        }
    })

    document.querySelector('.article-list').innerHTML = articleElement.join('')
}

function renderArticleByCategory(){

}


async function renderListArticleByCategory(data_category) {

    var list_article_by_category = await getArticleByCategory(data_category[0].id_category)
    // console.log(typeof list_article_by_category)
    // console.log(list_article_by_category)

    // list_article_by_category = list_article_by_category.sort(function (b, a) {
    //     return new Date(b.datetime_article) - new Date(a.datetime_article);
    // });
    // console.log(list_article_by_category)


    var list_category = document.querySelector('.list-category')
    
    for (let i = 0; i < data_category.length; i++) {
        var list_article_by_category = await getArticleByCategory(data_category[i].id_category)
        list_article_by_category = list_article_by_category.sort(function (a, b) {
            return new Date(b.datetime_article) - new Date(a.datetime_article);
        });
      
        if (list_article_by_category.length >= 5) {
            var category_item = document.createElement('div')
            category_item.classList.add('category-item')
            category_item.innerHTML = `<div class="header__category">
        <div class="icon-header-retangle-category"></div>
        <span>${data_category[i].name_category}</span>
        </div>`



            var category_articleElement = document.createElement('div')
            category_articleElement.classList.add('category-article')
            var categoryItemSideList = []
            for (let j = 0; j < 5; j++) {
                if (j == 0) {
                   
                    category_articleElement.innerHTML =
                        `<a class="link-article" href="http://127.0.0.1:5500/layout/detailArticle.html?id_article=${list_article_by_category[j].id_article}"><div class="primary-article">
                        <div class="img__primary-item">
                            <img src="${list_article_by_category[j].img}" alt="">
                        </div>
                        <div class="content__primary-article">
                            <div class="primary-article__title">${list_article_by_category[j].nameArticle}</div>
                            <div class="primary-article__time">
                                <i class="far fa-clock"></i>
                                ${formattime(list_article_by_category[j].datetime_article)}
                            </div>
                            <div class="primary-article__description">${list_article_by_category[j].desciption}</div>
                        </div>
                    </div></a>`;
                }
                if (j > 0) {
                    var categoryItemElementItem = ` <a class="link-article" href="http://127.0.0.1:5500/layout/detailArticle.html?id_article=${list_article_by_category[j].id_article}"><div class="side-article__item">
                <div class="img__side-item">
                    <img src="${list_article_by_category[j].img}" alt="">
                </div>
                <div class="title__side-item">${list_article_by_category[j].nameArticle}</div>
            </div></a>`
                    categoryItemSideList.push(categoryItemElementItem)
                }
            }

            var list__side_article = document.createElement('div')
            list__side_article.classList.add('list__side-article')
            list__side_article.innerHTML = categoryItemSideList.join('')
            category_articleElement.append(list__side_article)
            category_item.append(category_articleElement)
            list_category.append(category_item)
        }
    }
}



function formattime(datestr) {
    var d = new Date(datestr)
    return d.toString().substring(0, 24)
}


// function sortArticleByTime(list_article_by_category){
//     list_article_by_category = list_article_by_category.sort(function (a, b) {
//         return new Date(b.datetime_article) - new Date(a.datetime_article);
//     });
//     return list_article_by_category
// }