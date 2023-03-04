<?php
$class = $args['class'] ?? '';
?>

<div data-type="molecules/search/search-form" class="a__search <?php echo esc_attr( $class ); ?>">
	<?php get_search_form(); ?>
</div>
