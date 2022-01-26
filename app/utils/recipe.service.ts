import axios from 'axios';
import ValidationError from './errors/ValidationError';
import Search from './search';

class RecipeService {
  async search(url: string) {
    const { data } = await axios.get(url);

    const ldTag = data.match(/<script type="application\/ld\+json"[^>]*>([\s\S]+?)<\/script>/gi);
    if (!ldTag) throw new ValidationError('This is not a recipe');

    const recipe = ldTag[0].replace(/(<([^>]+)>)/ig, '');

    if (!recipe) throw new ValidationError('This is not a recipe.');

    const dfs = new Search();
    const nutes = dfs.run(JSON.parse(recipe), 'nutrition')

    if (!nutes) throw new ValidationError('There is no nutrition data available.');

    return {
      cals: this.splitValue(nutes.calories),
      fat: this.splitValue(nutes.fatContent),
      protein: this.splitValue(nutes.proteinContent),
      carbs: this.splitValue(nutes.carbohydrateContent),
    }
  }

  private splitValue(value: string) {
    const splitUp = value.split(' ');

    return {
      value: parseFloat(splitUp[0].trim()),
      unit: (splitUp[1] || '').trim(),
    }
  }
}

export default new RecipeService();