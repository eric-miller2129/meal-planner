import axios from 'axios';

class RecipeService {
  async getNutrition(url: string) {
    const { data } = await axios.get(url);
    const ldTag = data.match(/<script type="application\/ld\+json"[^>]*>([\s\S]+?)<\/script>/gi)[0];
    const recipe = ldTag.replace(/(<([^>]+)>)/ig, '');
    const nutrition = this.getValues(recipe);

    if (!nutrition) throw new Error('Nutrition information not found.');

    return {
      cals: this.splitValue(nutrition.calories),
      fat: this.splitValue(nutrition.fatContent),
      protein: this.splitValue(nutrition.proteinContent),
      carbs: this.splitValue(nutrition.carbohydrateContent),
    };
  }

  private getValues(recipe: string) {
    const recipeJson = JSON.parse(recipe);

    if (recipeJson['@graph'] === undefined) {
      return null;
    }

    const recipeGraph = recipeJson['@graph'].find((i: any) => i['@type'] === 'Recipe');

    return recipeGraph.nutrition;
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