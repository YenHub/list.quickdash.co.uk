$(document).ready(function() {

    $(document).on('click', 'th', sortTable);

    // Handle Sort
    function sortTable(e) {
        // Identify the index of the column clicked
        const columnInd = Array.from(e.target.parentNode.children).indexOf(e.target);
        const table = e.target.closest('table');
        const sortAsc = e.target.getAttribute('data-sortAsc') === 'true';
        var switching = true;
        var rows, i, shouldSwitch;
        /* Iterate our elements until no more switching is required */
        while(switching) {
            /* Assume we don't need to switch */
            switching = false;
            rows = table.rows;
            /* Iterate all but the first row (header) */
            for(i = 1; i < (rows.length - 1); i++) {
                /* Assume we don't need to switch */
                shouldSwitch = false;
                /* Get the text for the cells we want to compare */
                const textX = rows[i].getElementsByTagName("TD")[columnInd].innerHTML.toString();
                const textY = rows[i + 1].getElementsByTagName("TD")[columnInd].innerHTML.toString();
                let triggerSwitch;
                if(/^\d+|\.$/.test(Number(textX)) && /^\d+|\.$/.test(Number(textY))) {
                    /* Here we are just comparing two numbers */
                    triggerSwitch = sortAsc ? Number(textX) < textY : Number(textX) > textY;
                } else {
                    /* Here we are localeComparing two strings */
                    triggerSwitch = sortAsc ? textX.localeCompare(textY) < 0 : textX.localeCompare(textY) > 0;
                }
                if(triggerSwitch) {
                    /* Break out of the loop & switch rows */
                    shouldSwitch = true;
                    break;
                }
            }
            if(shouldSwitch) {
                /* Switch the elements & continue switching */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
        e.target.setAttribute('data-sortAsc', !sortAsc);
    }
});