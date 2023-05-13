console.log('프로필 js 로딩');

$(document).ready(async function () {
    $('.hidden').hide();
    $('.permission').hide();

    let urlParam = new URLSearchParams(window.location.search);
    let user_id = urlParam.get('user_id');
    console.log(user_id);

    if (localStorage.getItem("payload")) {
        const payload = localStorage.getItem("payload");
        const payload_parse = JSON.parse(payload)

        const me_id = payload_parse.user_id;
        console.log(me_id)

        const token = localStorage.getItem("access");
        console.log(token)

        // 접속 유저와 프포필 유저가 같다면 ?
        if (me_id == user_id) {
            $('.permission').show();
        };
    };

    // 임시 보이게 하게 로그인 되면 다시 삭제
    // $('.permission').show();


    const response = await getProfile(user_id);
    // console.log(response)

    // 프로필 이미지 처리
    const profileImage = $('#profile-image');
    profileImage.empty();

    const newImage = $('<img>');
    if (response.profile_img) {
        newImage.attr('src', `${backend_base_url}${response.profile_img}`);
    } else {
        newImage.attr('src', 'https://img.freepik.com/free-photo/adorable-kitty-looking-like-it-want-to-hunt_23-2149167099.jpg?size=626&ext=jpg');
    }
    newImage.addClass('rounded mx-auto d-block view-img');
    newImage.css({ width: '80%', height: '80%' });
    profileImage.append(newImage);

    // if (response.profile_img) {
    //     $('#img').attr('src', `${backend_base_url}${response.profile_img}`);
    // } else {
    //     $('#img').attr('src', 'https://img.freepik.com/free-photo/adorable-kitty-looking-like-it-want-to-hunt_23-2149167099.jpg?size=626&ext=jpg');
    // }
    // $('#img').addClass('rounded mx-auto d-block view-img');
    // $('#img').css({ width: '80%', height: '80%' });

    // 닉네임 처리
    if (!response.nickname) {
        response.nickname = '없음';
    }
    $('#nickname').text(response.nickname);
    $('#myNickname').val(response.nickname);

    // 이메일 처리
    if (!response.email) {
        response.email = '없음';
    }
    $('#email').text(response.email);

    // 카테고리 처리
    if (!response.category) {
        response.category = '없음';
    }
    $('#category').text(response.category);
    // 미리 셀렉트에도 저장
    $('#mySelect').val(response.category);

    // articles_count 작성한 게시글 수
    const response2 = await getProfile2(user_id);
    $('#articles_count').text(response2.length);

    // receive_hearts_count 받은 좋아요 수
    const response3 = await getProfile3(user_id);
    $('#receive_hearts_count').text(response3);

    // 팔로잉 수
    $('#followings').text(response.followers.length);

    // 팔로워 수
    $('#followers').text(response.followers.length);

    // 좋아요한 게시글 수
    $('#hearted_articles_count').text(response.hearted_articles_count);

    // 북마크한 게시글 수
    $('#bookmarked_articles_count').text(response.bookmarked_articles_count);





    $('#edit-btn').click(function () {
        console.log('히든 보이게')
        $('.hidden').show();
        $('#edit-btn').hide();
        $('.original-content').hide();
    });

    $('#cancel-btn').click(function () {
        console.log('히든 숨기기')
        $('.hidden').hide();
        $('#edit-btn').show();
        $('.original-content').show();
    });

    // 이미지 띄우기, 아직 업로드X
    $('#image-input').click(function () {
        console.log('이미지 띄우기');
        $('#image-input').change(function () {
            var file = this.files[0];
            var reader = new FileReader();

            // 파일 크기 제한 (단위: 바이트)
            var maxSize = 3 * 100 * 1024; // 300KB 제한

            // 파일 유효성 검사
            var validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // 허용되는 이미지 파일의 MIME 유형들
            if (!validImageTypes.includes(file.type)) {
                alert('이미지 파일만 업로드할 수 있습니다.');
                return;
            }

            // 파일 크기 검사
            if (file.size > maxSize) {
                alert('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
                return;
            }

            // FileReader를 사용하여 이미지 파일을 읽고, 미리보기 이미지로 설정
            reader.onload = function (e) {
                $('.view-img').attr('src', e.target.result);
                $('.view-img').addClass('card-img-top')
            }
            reader.readAsDataURL(file);
        })
    });


    // await을 쓰려면 이렇게?
    // const response4 = await function putProfile();


    //  권한이 있는지 있으면 그걸로 보내야하는데...
    // 페이로드에서 뽑아서?
    // 파일만 변경이 안됨.
    $('#confirm-btn').click(async function () {
        // 선택한 이미지 파일 가져오기
        console.log("유저아이디??");
        console.log(user_id);
        const imageFile = $('#image-input')[0].files[0];
        console.log("이미지파일");
        console.log(imageFile);

        // 선택한 카테고리 값 가져오기
        var selectedCategory = $('#mySelect').val();
        console.log("셀렉트 값");
        console.log(selectedCategory);

        var myNickname = $('#myNickname').val();

        // FormData 객체 생성
        var formData = new FormData();
        if (imageFile) {
            formData.append('profile_img', imageFile);
        }
        // 카테고리가 있다면
        if (selectedCategory) {
            formData.append('category', selectedCategory);
        }
        // 닉네임이 있다면
        if (myNickname) {
            formData.append('nickname', myNickname);
        }

        console.log("폼데이타");
        if (formData.has('category')) {
            console.log('카테고리가 존재합니다.');
        } else {
            console.log('카테고리가 존재하지 않습니다.');
        }
        if (formData.has('profile_img')) {
            console.log('이미지가 존재합니다.');
        } else {
            console.log('이미지가 존재하지 않습니다.');
        }

        // 비어있는 값이면 못 보내게 조치를 해야함.

        // console.log(user_id);
        //AJAX 요청 보내기
        const response = await $.ajax({
            url: `${backend_base_url}/users/profile/${user_id}/`,
            type: 'PATCH',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`
                // Authorization: `Bearer ${token}`
            }
        });
        if (response) {
            alert("수정 성공")
            // window.location.href = "profile.html";
            $('.hidden').hide();
            $('#edit-btn').show();
            $('.original-content').show();
            // 눈속임으로 값만 대입시킬 수 도 있음. 미리...
            location.reload();
        } else {
            alert("수정 실패")
            window.location.href = "404.html";
            // alert(textStatus)
        }

    });

    // $('.content').mouseenter(function () {
    //     $('#original-content').hide();
    //     $('#hover-content').show();
    // });
    // $('.content').mouseleave(function () {
    //     $('#hover-content').fadeOut(1000, function () {
    //         $('#original-content').fadeIn(1000);
    //     });
    // });

    // $('#edit-btn').click(function () {
    //     $('.content').hide();
    //     var inputElement = $('<input type="text">');
    //     // 백엔드에서 카테고리 전체목록 가져와서 셀렉트 뜨게 하기...
    //     // 하지만 오래 걸리니 셀렉트에서 우선 선택하기
    //     // if (response.profile_img) {
    //     //     newImage.attr('src', `${backend_base_url}${response.profile_img}`);
    //     // } else {
    //     //     newImage.attr('src', 'https://img.freepik.com/free-photo/adorable-kitty-looking-like-it-want-to-hunt_23-2149167099.jpg?size=626&ext=jpg');
    //     // }
    //     inputElement.addClass('rounded mx-auto');
    //     inputElement.css({ width: '40%', height: '80%' });
    //     $('.content_edit').append(inputElement);

    //     var inputButton = $('<button>완료</button>');
    //     inputButton.addClass('rounded mx-auto');
    //     $('.content_edit').append(inputButton);

    //     var inputButton2 = $('<button>취소</button>');
    //     inputButton2.addClass('rounded mx-auto');
    //     $('.content_edit').append(inputButton2);

    //     var selectElement = $('<select></select>');


    //     $('.content_edit').show();
    // });


});