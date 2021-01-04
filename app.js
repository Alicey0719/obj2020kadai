window.onload = Main;

const jsonServer = "http://10.2.5.212:3000/pics";


let libApp;

function Main() {

    const VModal = window["vue-js-modal"].default;
    Vue.use(VModal);

    libApp = new Vue({
        el: '#app',
        data: {
            input: "",
            pics: [],
            showId: '0',
            showModal: false,
            showEditData: false,
            editName: "",
            editDate: "",
            editPlace: "",
            editExp: "",
            editImage: ""
        },
        methods: {
            update: function () {
                this.$nextTick(() => {
                    let url = "?name_like=" + this.input;
                    url = jsonServer + encodeURI(url);
                    getData(url);
                });

            },
            show: function (picID) {
                //console.log(picID);
                libApp.showModal = true;
                libApp.showId = picID;
                this.$nextTick(() => {
                    //console.log(libApp.showId);
                    this.$modal.show('picView');
                });
            },
            hide: function () {
                console.log("hide");
                this.$modal.hide('picView');
                libApp.showModal = false;
                libApp.showEditData = false;
                this.$nextTick(() => {
                });
            },
            searchPicByName: function (event) {
                //console.log("Search");
                let url = "?name_like=" + this.input;
                url = jsonServer + encodeURI(url);
                console.log(url);
                getData(url);
            },
            vDropData: function (id) {
                console.log('vDropData');
                //console.log(id);

                dropData(id);

                Promise.resolve()
                    .then(wait(0.5))
                    .then(function () {
                        libApp.hide();
                        libApp.update();
                    })
                    .catch(function (err) {
                        console.error(err);
                        self.result_message = error;
                    });
            },
            vEditData: function (id) {
                this.editName = this.pics[id].name;
                this.editDate = this.pics[id].date;
                this.editPlace = this.pics[id].place;
                this.editExp = this.pics[id].exp;
                libApp.showEditData = !libApp.showEditData;
                this.$nextTick(() => {
                });
            },
            vEditSubmit: function (id, picId) {
                console.log('vEditSubmit');
                libApp.showEditData = false;
                //console.log(id, picId);
                //console.log(this.pics[picId].image);
                this.editImage = this.pics[picId].image;
                editData(id);
                Promise.resolve()
                    .then(wait(0.5))
                    .then(function () {
                        //libApp.hide();
                        libApp.update();
                    })
                    .catch(function (err) {
                        console.error(err);
                        self.result_message = error;
                    });
            }
        },
        mounted: function (event) {
            let url = "?name_like=" + this.input;
            url = jsonServer + encodeURI(url);
            getData(url);

        }
    })
}

function getData(url) {
    //console.log("getData");
    fetch(url, { method: 'GET' })
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            if (Array.isArray(res)) {
                libApp.pics = res;
                //console.log(libApp.pics);
            }
            else {
                libApp.pics = [res];
                //console.log(libApp.pics);
            }
        });
}

function editData(id) {
    let url = jsonServer + '/' + id;
    let data = {
        id: id,
        name: libApp.editName,
        image: libApp.editImage,
        date: libApp.editDate,
        place: libApp.editPlace,
        exp: libApp.editExp
    };

    fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
}



function dropData(id) {
    let url = jsonServer + '/' + id;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));

}

function wait(sec) {
    return function () {
        return new Promise(function (resolve) {
            setTimeout(resolve, sec * 1000)
        });
    }
};