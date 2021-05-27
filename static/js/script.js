$(document).ready(function() {
    $(".year").text(new Date().getFullYear())
    $(".dropdown-toggle").dropdown()
    $.each($(".showdate"), function(index, element) {
        const txt = $(this).text()
        $(this).text(new Date(parseInt(txt)).toDateString())
    })
    $.each($(".marked"), function(index, element) {
        const src = $(this).data("src")
        var elem = $(this)
        if (src !== undefined) {
            $.ajax({url: src, success: function(result) {
                elem.html(marked(result))
            }})
        } else {
            const txt = elem.text()
            elem.html(marked(txt))
        }
    })
})