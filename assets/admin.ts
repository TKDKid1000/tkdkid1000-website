import "jquery"
// import "jqueryui"

function admin() {
    $(".sortable-list").sortable()
    $("#save").on("click", function() {
        const sort = $("#sort")[0]
        // https://stackoverflow.com/a/44293677
        const Elem = e => ({
            toJSON: () => ({
                tagName: e.tagName,
                textContent: e.textContent,
                attributes: Array.from(e.attributes, ({name, value}) => [name, value]),
                children: Array.from(e.children, Elem)
            })
        })
        const htmlToJson = e => JSON.stringify(Elem(e), null, "  ")
        //
        var forums = $("#sort").sortable("toArray")
        console.log(forums)
        forums.forEach(element => {
            console.log(typeof(element))
        });
        // $("#json-input").val(htmlToJson(sort));
        // $("#editor-type").val("forums");
        // $("#admin-form").submit()
    })
}

export {admin}