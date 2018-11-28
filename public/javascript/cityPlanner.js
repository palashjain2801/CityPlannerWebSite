$( document ).ready(function() {
    $.get( "searches", function( searches ) {
        let tableBody = $("#search-table > tbody");
        searches.forEach(function (search) {
            let row = $("<tr>");
            let cityCell = $("<td>");
            let numDaysCell = $("<td>");
            let numPlacesCell = $("<td>");
            cityCell.text(search.city);
            numDaysCell.text(search.numDays);
            numPlacesCell.text(search.numPlaces)
            row.append(cityCell);
            row.append(numDaysCell);
            row.append(numPlacesCell);
            tableBody.append(row);
        });
      });

      $('#newSearchForm').ajaxForm({
        url:'searches',
        method: 'post',
        dataType: 'json',
        data: $("#newSearchForm").serialize(),
        success: function() {
            //document.location.href="/";
      }
    });
});