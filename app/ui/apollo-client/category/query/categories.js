import gql from 'graphql-tag';
import categoryFragment from '../fragment/category';

const categoriesQuery = gql `

  query categories ($category_name: String, $search: String,$searchField: String) {
  getCategories(category_name: $category_name, search: $search, searchField:$searchField) {
    ...categoryFragment
  }
}
  ${categoryFragment}
`;

export default categoriesQuery;
