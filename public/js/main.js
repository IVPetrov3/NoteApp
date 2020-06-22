$(document).ready(function() {
    $('.delete-note').on('click', function(e) {
        $target = $(e.target);
        const id = ($target.attr('data-id'));
        var confirmation = confirm("Are you sure you want to delete this note?");
        if (confirmation) {
            $.ajax({
                type:'DELETE',
                url: '/notes/'+id,
                success: function(response) {
                    alert('Note is being deleted');
                    window.location.href="/dashboard";
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });
});