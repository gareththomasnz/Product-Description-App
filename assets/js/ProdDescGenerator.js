var formHTML = $("#form").html();
var flawsSection = $("#flaws-group").html();
// Activate all popovers
$(function () {
	$('[data-toggle="popover"]').popover()
});

var genderMap = {
	"female" : "Women's",
	"male" : "Men's",
	"youth" : "Youth's"
}

var sizeMap = {
	"xs" : "XS",
	"s" : "Small",
	"m" : "Medium",
	"l" : "Large",
	"xl" : "XL",
	"2xl" : "XXL",
	"3xl" : "XXXL",
}

$("input[name='type-selection']").change(function(){
	setForm();
});

$(document).on("click", "#clear-btn", function(){
	setForm();
});

$(document).on('click', 'input[type=radio]', function(e){
    if (e.ctrlKey) {
        $(this).prop('checked', false);
    }
});

$(document).on('click', '#generate-btn', function(){
	generateDescription($("textarea"));
});

$(document).on('keyup', '#flaws', function(){
	($(this).val() !== "") ? $("#flaws-append-text").prop("disabled", false) : $("#flaws-append-text").prop("disabled", true)
});

$(document).on('change', '#same-size', function(){
	// Need to fill this
	// Select the same options as size on label
	var labelGender = $("input[name=label-gender]:checked");
	var labelSize = $("input[name=label-size]:checked");
	if(labelGender.length > 0) {$("input[name=recommended-gender][value=" + labelGender.val() + "]").prop('checked', true)}
	if(labelSize.length > 0) {$("input[name=recommended-size][value=" + labelSize.val() + "]").prop('checked', true)}
	if ($("input[name='type-selection']:checked").val() !== "tops") $("#recommended-extra").val($("#label-extra").val());
});

$(document).on('change', '#no-label', function() {
	var labelInputs = $("input[name=label-gender], input[name=label-size]");
	if($(this).prop("checked") === true) {
		labelInputs.prop("disabled", true);
		$("#same-size").prop("checked", false);
		$("#same-size").prop("disabled", true);
	}
	else {
		labelInputs.prop("disabled", false);
		$("#same-size").prop("disabled", false);
	}
});

$(document).on('change', 'input[name=recommended-size], input[name=label-size], input[name=recommended-gender], input[name=label-gender], #recommended-extra, #label-extra', function(){
	$("#same-size").prop("checked", false);
});
$(document).on('keydown', '#recommended-extra', function(event) {
	$("#same-size").prop("checked", false);
});

$(document).on('click', '#flaws-reset', function() {
	$("#flaws-group").html(flawsSection);
})

$(document).on('click', '#copy-btn', function(event) {
	$("textarea").select();
    document.execCommand('copy');
    $(".popover-body").text('Copied!');
    $('#copy-btn').popover('update');

});
$(document).on('hidden.bs.popover', "#copy-btn", function () {
	$("#copy-btn").attr("data-content", "Copy to clipboard");
});

function setForm() {
	$("#form").html(formHTML); // Default form is setup for Tops
	var m1Section = $("#measurement1-input-group");
	var m1label = m1Section.find('label');
	var m1inputSection = m1Section.find('>div');

	var radioValue = $("input[name='type-selection']:checked").val();
	if (radioValue === "bottoms") {
		m1label.html("<strong>Waist:</strong>");
		m1label.toggleClass('col-3 col-xl-4 col-5');
		m1inputSection.toggleClass('col-5 col-4');
		m1Section.append('-' + '<div class="col-4">' + m1inputSection.html() + '</div>');
	}
	if (radioValue === "jeans") {
		m1label.html("<strong>Waist:</strong>");
		$("#measurement2-input-group label").html("<strong>Inseam:</strong>")
	}
	// Activate popovers
	$('[data-toggle="popover"]').popover();
}

function generateDescription(el) {
	var desc = "Title:" + getTitle() + "\n\nSize On Label: " + getSizeOnLabel() + 
		"\n\nRecommended Size: " + getRecommendedSize() + "\n\nMeasurements:\n" + getMeasurements() + 
		getFlaws() + "\n\nBrand: " + $("#brand").val() + "\n\nPrice: $" + $("#price").val();
	el.text(desc);
}

function getTitle() {
	var title = "";
	if($("#vintage")[0].checked) {title += " Vintage"};
	for (var i = 0; i < $("#title-group>input").length; i++) {
		var input = $("#title-group>input")[i];
		if(input.value != "") title += " " + input.value;
	}
	title += " - " + getRecommendedSize();
	return title;
}

function getRecommendedSize() {
	var gender = genderMap[$("input[name=recommended-gender]:checked").val()];
	var size = sizeMap[$("input[name=recommended-size]:checked").val()];
	var extra = $("#recommended-extra").val();
	var recommendedSize = "";
	if(gender != undefined) recommendedSize += gender + " ";
	if(size != undefined) recommendedSize += size + " ";
	recommendedSize += extra;

	return recommendedSize;
}

function getSizeOnLabel() {
	if($("#no-label").prop("checked") === true) { return "N/A"; }

	var gender = genderMap[$("input[name=label-gender]:checked").val()];
	var size = sizeMap[$("input[name=label-size]:checked").val()];
	var extra = $("#label-extra").val();
	var labelSize = "";
	if(gender != undefined) labelSize += gender + " ";
	if(size != undefined) labelSize +=  size + " ";
	labelSize += extra;

	return labelSize;
}

function getMeasurements() {
	var m1Inputs = $("#measurement1-input-group input");
	var m1String = $("#measurement1-input-group label").text() + " ";
	m1String += m1Inputs.val() + "\"";
	if(m1Inputs.length === 2 && m1Inputs[1].value !== "") m1String += " - " + m1Inputs[1].value + "\"";

	var m2String = $("#measurement2-input-group label").text() + " " + $("#measurement2").val() + "\"";

	return m1String + "\n" + m2String;
}

function getFlaws(){
	var flawString = "";
	var flawType = $("#flaw-type").val();
	var flaw = $("#flaws").val();

	if(flawType !== "none") { flawString += flawType + " "; }
	if(flaw !== "") { 
		flawString += flaw;
		if($("#flaws-append-text").prop('checked') === true) flawString += ", please check additional picture(s) for more info"; 
	}
	
	if (flawString !== "") {
		flawString = flawString.charAt(0).toUpperCase() + flawString.slice(1).toLowerCase();
		flawString = "\n*" + flawString;
	}

	return flawString;
}