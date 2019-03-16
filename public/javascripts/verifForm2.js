$(document).ready(function() {
    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        console.log(pattern.test(emailAddress));
        return pattern.test(emailAddress);
    }
    function valid(){
        var actualDate = new Date();
        console.log($(".form-control"))
        if (!isValidEmailAddress($("#inputEmail").val())
            || $("#inputFirstName").val()==""
            || $("#inputLastName").val()==""
            || $("#inputPseudo").val()==""
            || $("#inputBirth").val()==""
            || $("#inputEmail").val().length >= 50
            || $("#inputFirstName").val().length >= 50
            || $("#inputPseudo").val().length >= 50
            || $("#inputPhone").val().length > 10
            || $("#inputVille").val().length >= 50
            || $("#inputBlog").val().length >= 250
            || $("#inputSexe").val().length >= 11
            || $("#inputSituation").val().length >= 50) {
            console.log("problem taille");
            $('#send').attr('disabled', 'true');
        }else {
            var birth = new Date($("#inputBirth").val());
            if (actualDate.getFullYear()-birth.getFullYear()>16){
                console.log("OK");
                $('#send').removeAttr('disabled');
            }else{
                console.log("problem year");
                $('#send').attr('disabled', 'true');
            }
        }
    }

    $(".form-control").click(function (event) {
        valid();
    });

    $(".form-control").keyup(function (event) {
        valid();
    });
});