
$('#filters-btn').click(function () {
  var filters = $('.filters-section');
  var expander = $('.expander-icon');

  filters.toggleClass('menu-visible');

  if(filters.hasClass('menu-visible')) {
    expander.removeClass('fa-plus');
    expander.addClass('fa-minus');
  } else {
    expander.removeClass('fa-minus');
    expander.addClass('fa-plus');
  }
});

$('#sort-btn').click(function () {
  var dropdown = $('.dropdown-content');
  var icon = $('.sorter-icon');

  dropdown.toggleClass('menu-visible');

  if(dropdown.hasClass('menu-visible')){
    icon.removeClass('fa-angle-down');
    icon.addClass('fa-angle-up');
  } else {
    icon.removeClass('fa-angle-up');
    icon.addClass('fa-angle-down');
  }
});

$('.single-filter').click(function () {
  $(this).toggleClass('filter-active');
});

$('.reset').click(function () {
  var filterBlock = $(this).parent().parent();
  var selectedFilters = filterBlock.find('.filter-active');

  selectedFilters.removeClass('filter-active');
});

$('.expander-wp').click(function () {
  var expander = $(this);
  var icon = $(this).find('.expander-filter-icon');
  var parentNode = $(expander[0].parentElement);
  var nestedList = parentNode.find('.second-level-filter');

  nestedList.toggleClass('second-level-visible');

  if(icon.hasClass('fa-plus')){
    icon.removeClass('fa-plus');
    icon.addClass('fa-minus');
  }else {
    icon.removeClass('fa-minus');
    icon.addClass('fa-plus');
  }
});