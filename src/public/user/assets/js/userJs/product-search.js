document.addEventListener("click", function (event) {
    const suggestionList =
        document.getElementById("suggestionList");
    const isClickInside = suggestionList.contains(event.target);

    if (!isClickInside) {
        suggestionList.innerHTML = ""; // Hide the suggestions by clearing the innerHTML
    }
});

let searchElement = document.getElementById("searchInput");
searchElement.onkeyup = function () {
    let searchWord = searchElement.value;
    if (searchWord != "") {
        loadData(searchWord);
    } else {
        document.getElementById("suggestionList").innerHTML =
            "";
    }
};

function loadData(query = "") {
    fetch("/search-product", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: query }),
    })
        .then((res) => res.json())
        .then((data) => {
            let searchResult = data.searchResult;

            let html = "";
            if (data.searchResult.length > 0) {
                for (
                    let i = 0;
                    i < data.searchResult.length;
                    i++
                ) {
                    html += `<a href="/quick-view/${data.searchResult[i].slug}"><li style="  border-bottom: 1px solid #acb1b5; width:330px ;padding:10px"> ${data.searchResult[i].product_name} <img class="img-thumbnail" width="50" src="/product-images/${data.searchResult[i].image[0].filename}" alt="no image avalable"></li></a>`;
                    document.getElementById(
                        "suggestionList"
                    ).innerHTML = html;
                }
            }
        });
}