$(document).ready(function() {
    $(".year").text(new Date().getFullYear())
    $(".dropdown-toggle").dropdown()
    $.each($(".showdate"), function(index, element) {
        const txt = $(this).text()
        $(this).text(new Date(parseInt(txt)).toDateString())
    })
})