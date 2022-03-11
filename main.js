let API = "http://localhost:8000/students";

let studentsList = $("#students-list");
let details = $('.details');
let search = $("#search");
let pagination = $("#pagination");
let filtersKPIFromInp = $("#filters-KPI-from");
let filtersKPIToInp = $("#filters-KPI-to");
let addFormName = $("#add-form-name");
let addFormSurName = $("#add-form-surname");
let addFormKPI = $("#add-form-KPI");
let addFormKPIMonth = $("#add-form-KPIMonth");
let addFormVideo = $("#add-form-video");
let addFormImage1 = $("#add-form-image-1");
let addFormImage2 = $("#add-form-phone");
let addFormSaveBtn = $("#add-form-save-btn");
let unvisible = $('.unvisible')
let closeBtn = $('#close-btn')
let editFormName = $("#edit-form-name");
let editFormSurName = $("#edit-form-surname");
let editFormKPI = $("#edit-form-KPI");
let editFormKPIMonth = $("#edit-form-KPIMonth");
let editFormVideo = $("#edit-form-video");
let editFormImage1 = $("#edit-form-image-1");
let editFormImage2 = $("#edit-form-phone");
let editFormId = $("#edit-form-id");
let editFormSaveBtn = $("#edit-form-save-btn");
let page = 1;
let limit = 12;
addFormSaveBtn.on("click", async function () {
    unvisible.css('display', 'block')
    let newStudent = {
        name: addFormName.val(),
        surname: addFormSurName.val(),
        KPI: +addFormKPI.val(),
        KPIMonth: +addFormKPIMonth.val(),
        video: addFormVideo.val(),
        image1: addFormImage1.val(),
        image2: addFormImage2.val()
    };
    await fetch(API, {
        method: "POST",
        body: JSON.stringify(newStudent),
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },

    });
    getStudents();

});
closeBtn.on("click", function () {
    unvisible.css('display', 'none')
})

async function getStudents() {
    let data = await fetch(`${API}?q=${search.val()}&_page=${page}&_limit=${limit}&KPI_gte=${filtersKPIFromInp.val()}&KPI_lte=${filtersKPIToInp.val()}`).then((res) => res.json());
    console.log(data);
    studentsList.empty();
    data.forEach((student) => {
        studentsList.append(`
      <div id=${student.id} class="card m-2" style="width: 14rem;">
      <img src=${student.image1} class="card-img-top" alt="...">
      <div class="card-body">
        <h6 class="card-title">${student.name} ${student.surname}</h6>
        <p class="card-text">KPI: ${student.KPI}</p>
        <p class="card-text">KPIMonth: ${student.KPIMonth}</p>
        <p class="card-text">Номер телефона: ${student.image2}</p>

        <div class="d-flex justify-content-around">
          <i class="fas fa-trash btn-delete"></i>
          <i class="fas fa-edit btn-edit" data-bs-toggle="modal"data-bs-target="#exampleModal"></i>
        
  </div>
      </div>
    </div>`);
    });
    pagination.html(`
  <button ${page == 1 ? "disabled" : ""} id="btn-prev"><-</button>
  <span>${page}</span>
  <button id="btn-next">-></button>
  `)
}
$("body").on("click", "#btn-prev", function () {
    page -= 1;
    getStudents()
})
$("body").on("click", "#btn-next", function () {
    page += 1;
    getStudents()
})

filtersKPIFromInp.on("input", getStudents)
filtersKPIToInp.on("input", getStudents)

getStudents();
search.on("input", getStudents)

$("body").on("click", ".btn-delete", async function (e) {
    let id = e.target.parentNode.parentNode.parentNode.id;
    await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
    });
    getStudents();
});

$("body").on("click", ".btn-edit", async function (e) {
    let id = e.target.parentNode.parentNode.parentNode.id;
    console.log(id);
    let editData = await fetch(`${API}/${id}`).then((res) => res.json());
    console.log(editData);
    editFormName.val(editData.name);
    editFormSurName.val(editData.surname);
    editFormKPI.val(editData.KPI);
    editFormKPIMonth.val(editData.KPIMonth);
    editFormVideo.val(editData.video);
    editFormImage1.val(editData.image1);
    editFormImage2.val(editData.image2);
    editFormId.val(editData.id);
});
editFormSaveBtn.on("click", async function () {
    let editedData = {
        name: editFormName.val(),
        surname: editFormSurName.val(),
        KPI: +editFormKPI.val(),
        KPIMonth: +editFormKPIMonth.val(),
        video: editFormVideo.val(),
        image1: editFormImage1.val(),
        image2: editFormImage2.val()
    };
    await fetch(`${API}/${editFormId.val()}`, {
        method: "PATCH",
        body: JSON.stringify(editedData),
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
    });
    getStudents();
});

