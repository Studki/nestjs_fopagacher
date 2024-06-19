import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import { allergy_entity } from 'src/allergy/entities/allergy.entity';
import { diet_entity } from 'src/diet/entities/diet.entity';
import { image_entity } from 'src/image/entity/image-file.entity';
import { quizz_entity } from 'src/quizz/entities/quizz.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { tag_entity } from 'src/tag/entities/tag.entity';
import { ustensile_entity } from 'src/ustensile/entities/ustensile.entity';
import { In, Repository } from 'typeorm';
import { read, readFileSync } from 'fs';
import { join } from 'path';
import { ImageService } from 'src/image/image.service';
import { user_entity } from 'src/user/entities/user.entity';
import { RecipeService } from 'src/recipe/recipe.service';
import { calendar_entity } from 'src/calendar/entities/calendar.entity';

const imageFolderPath = join(__dirname, 'images');
const apiUrl = 'https://api.patzenhoffer.eu';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(aliment_entity)
    private readonly alimentRepository: Repository<aliment_entity>,

    @InjectRepository(tag_entity)
    private readonly tagRepository: Repository<tag_entity>,

    @InjectRepository(recipe_entity)
    private readonly recipeRepository: Repository<recipe_entity>,
    private readonly recipeService: RecipeService,

    @InjectRepository(allergy_entity)
    private readonly allergyRepository: Repository<allergy_entity>,

    @InjectRepository(diet_entity)
    private readonly dietRepository: Repository<diet_entity>,

    @InjectRepository(quizz_entity)
    private readonly quizzRepository: Repository<quizz_entity>,

    @InjectRepository(ustensile_entity)
    private readonly ustensileRepository: Repository<ustensile_entity>,

    @InjectRepository(image_entity)
    private readonly imageRepository: Repository<image_entity>,
    private readonly imageService: ImageService,

    @InjectRepository(user_entity)
    private readonly userRepository: Repository<user_entity>,

    @InjectRepository(calendar_entity)
    private readonly calendarRepository: Repository<calendar_entity>,
  ) {}

  async seedTags(): Promise<void> {
    const tag1 = this.tagRepository.create({ tag: 'tag1' });
    const tag2 = this.tagRepository.create({ tag: 'tag2' });
    const tag3 = this.tagRepository.create({ tag: 'tag3' });
    const fruit = this.tagRepository.create({ tag: 'Fruit' });
    const legume = this.tagRepository.create({ tag: 'Légume' });
    const viande = this.tagRepository.create({ tag: 'Viande' });
    const poisson = this.tagRepository.create({ tag: 'Poisson' });
    const laitage = this.tagRepository.create({ tag: 'Laitage' });
    const cereale = this.tagRepository.create({ tag: 'Céréale' });
    const sucre = this.tagRepository.create({ tag: 'Sucre' });

    await this.tagRepository.save([
      tag1,
      tag2,
      tag3,
      fruit,
      legume,
      viande,
      poisson,
      laitage,
      cereale,
      sucre,
    ]);
  }

  async seedRecipes(): Promise<void> {
    // seed aliment
    const bulk = readFileSync(join(imageFolderPath, 'bulk.png'));
    const checklist = readFileSync(join(imageFolderPath, 'checklist.png'));
    const cupboard = readFileSync(join(imageFolderPath, 'cupboard.png'));
    const display = readFileSync(join(imageFolderPath, 'display.png'));
    const freezer = readFileSync(join(imageFolderPath, 'freezer.png'));
    const fridgeNormal = readFileSync(join(imageFolderPath, 'fridge.png'));
    const groceries = readFileSync(join(imageFolderPath, 'groceries.png'));
    const order = readFileSync(join(imageFolderPath, 'order.png'));
    const shopping_list = readFileSync(
      join(imageFolderPath, 'shopping-list.png'),
    );
    const fopaLogo = readFileSync(join(imageFolderPath, 'LogoFopagacher.png'));
    const appleLogo = readFileSync(join(imageFolderPath, 'LogoAppStore.png'));
    const googleLogo = readFileSync(
      join(imageFolderPath, 'LogoGooglePlay.png'),
    );
    const pommeVerteImage = readFileSync(
      join(imageFolderPath, 'pommeverte.jpg'),
    );
    const bananeImage = readFileSync(join(imageFolderPath, 'banane.jpg'));
    const orangeImage = readFileSync(join(imageFolderPath, 'orange.jpeg'));
    const haricotImage = readFileSync(
      join(imageFolderPath, 'Haricot Vert.jpeg'),
    );
    const maisImage = readFileSync(join(imageFolderPath, 'mais.jpeg'));
    const petitPoisImage = readFileSync(
      join(imageFolderPath, 'petitpoid.jpeg'),
    );
    const carotteImage = readFileSync(
      join(imageFolderPath, 'boitecarotte.jpeg'),
    );
    const tomateImage = readFileSync(
      join(imageFolderPath, 'boitedetomate.jpeg'),
    );
    const steakImage = readFileSync(join(imageFolderPath, 'steakhaché.jpeg'));

    // f47ac10b-58cc-4372-a567-0e02b2c3d479
    // 550e8400-e29b-41d4-a716-446655440000
    // 6ba7b810-9dad-11d1-80b4-00c04fd430c8
    // 123e4567-e89b-12d3-a456-426614174000
    // 9c858901-8a57-4791-81fe-4c455b099bc9
    // f86c9f7e-4f4e-40d8-9b63-6cdb74a7e8da
    // 7d444840-9dc0-11d1-b245-5ffdce74fad2
    // 16fd2706-8baf-433b-82eb-8c7fada847da
    // b4e7b020-857c-11e9-8f9e-2a86e4085a59

    const bulkImg = await this.imageService.createImage(
      'bulk.png',
      bulk,
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    );
    const checklistImg = await this.imageService.createImage(
      'checkList.png',
      checklist,
      '550e8400-e29b-41d4-a716-446655440000',
    );
    const cupboardImg = await this.imageService.createImage(
      'cupboard.png',
      cupboard,
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    );
    const displayImg = await this.imageService.createImage(
      'display.png',
      display,
      '123e4567-e89b-12d3-a456-426614174000',
    );
    const freezerImg = await this.imageService.createImage(
      'freezer.png',
      freezer,
      '9c858901-8a57-4791-81fe-4c455b099bc9',
    );
    const fridgeNormalImg = await this.imageService.createImage(
      'fridgeNormal.png',
      fridgeNormal,
      'f86c9f7e-4f4e-40d8-9b63-6cdb74a7e8da',
    );
    const groceriesImg = await this.imageService.createImage(
      'groceries.png',
      groceries,
      '7d444840-9dc0-11d1-b245-5ffdce74fad2',
    );
    const orderImg = await this.imageService.createImage(
      'order.png',
      order,
      '16fd2706-8baf-433b-82eb-8c7fada847da',
    );
    const shoppingListImg = await this.imageService.createImage(
      'shoppingList.png',
      shopping_list,
      'b4e7b020-857c-11e9-8f9e-2a86e4085a59',
    );
    const fopaLogoId = await this.imageService.createImage(
      'fopalogo.png',
      fopaLogo,
      '69e5e08a-5c85-4a5c-8f1d-f3b0c3f5e6a1',
    );
    const appleLogoId = await this.imageService.createImage(
      'applelogo.png',
      appleLogo,
      'c6b2c5d5-f0a4-4a0f-a527-b4fd0d45c2c5',
    );
    const googlePlayId = await this.imageService.createImage(
      'googleplaylogo.png',
      googleLogo,
      'f2e4ef1e-8674-4fa4-9c8d-20d27a3f52d9',
    );
    const pommeverteimageid = await this.imageService.createImage(
      'pommeverte.jpg',
      pommeVerteImage,
    );
    const bananeimageid = await this.imageService.createImage(
      'banane.jpg',
      bananeImage,
    );
    const orangeimageid = await this.imageService.createImage(
      'orange.jpeg',
      orangeImage,
    );
    const haricotimageid = await this.imageService.createImage(
      'Haricot Vert.jpg',
      haricotImage,
    );
    const maisimageid = await this.imageService.createImage(
      'mais.jpeg',
      maisImage,
    );
    const petitPoisimageid = await this.imageService.createImage(
      'petitpoid.jpeg',
      petitPoisImage,
    );
    const carotteimageid = await this.imageService.createImage(
      'boitecarotte.jpeg',
      carotteImage,
    );
    const tomateimageid = await this.imageService.createImage(
      'boitedetomate.jpeg',
      tomateImage,
    );
    const steakimageid = await this.imageService.createImage(
      'steakhaché.jpeg',
      steakImage,
    );

    const pommeVerte = this.alimentRepository.create({
      title: 'Pomme verte',
      description: 'Une pomme bien verte miam',
      price: 15,
      image: pommeverteimageid.id,
      category: 'Fruit',
      tag: 'Fruit',
      unit: 'unité',
    });

    const banane = this.alimentRepository.create({
      title: 'Banane',
      description: 'Une délicieuse banane jaune',
      price: 5,
      image: bananeimageid.id,
      category: 'Fruit',
      tag: 'Fruit',
      unit: 'unité',
    });

    const orange = this.alimentRepository.create({
      title: 'Orange',
      description: 'Une juteuse orange',
      price: 8,
      image: orangeimageid.id,
      category: 'Fruit',
      tag: 'Fruit',
      unit: 'unité',
    });

    const boiteHaricotVert = this.alimentRepository.create({
      title: 'Boite de haricot vert',
      description: 'Haricot vert en boite',
      price: 5,
      image: haricotimageid.id,
      category: 'Légume',
      tag: 'Légume',
      unit: 'unité',
    });

    const boiteMais = this.alimentRepository.create({
      title: 'Boite de mais',
      description: 'Mais en boite',
      price: 12,
      image: maisimageid.id,
      category: 'Légume',
      tag: 'Légume',
      unit: 'unité',
    });

    const boitePetitPois = this.alimentRepository.create({
      title: 'Boite de petit pois',
      description: 'Petit pois en boite',
      price: 125,
      image: petitPoisimageid.id,
      category: 'Légume',
      tag: 'Légume',
      unit: 'unité',
    });

    const boiteCarotte = this.alimentRepository.create({
      title: 'Boite de carotte',
      description: 'Carotte en boite',
      price: 10,
      image: carotteimageid.id,
      category: 'Légume',
      tag: 'Légume',
      unit: 'unité',
    });

    const boiteTomate = this.alimentRepository.create({
      title: 'Boite de tomate',
      description: 'Tomate en boite',
      price: 5,
      image: tomateimageid.id,
      category: 'Légume',
      tag: 'Légume',
      unit: 'unité',
    });

    const steakHache = this.alimentRepository.create({
      title: 'Steak haché',
      description: 'Steak haché',
      price: 25,
      image: steakimageid.id,
      category: 'Viande',
      tag: 'Viande',
      unit: 'unité',
    });

    const pancetta = this.alimentRepository.create({
      title: 'Pancetta',
      description: 'Pancetta',
      price: 15,
      image: apiUrl + '/images/pancetta.jpg',
      category: 'Viande',
      tag: 'Charcuterie',
      unit: 'gramme',
    });

    const oeufs = this.alimentRepository.create({
      title: 'Oeufs',
      description: 'Oeufs',
      price: 5,
      image: apiUrl + '/images/oeufs.jpg',
      category: 'Produits laitiers',
      tag: 'Œufs',
      unit: 'unité',
    });

    const fromagePecorino = this.alimentRepository.create({
      title: 'Fromage Pecorino',
      description: 'Fromage Pecorino',
      price: 12,
      image: apiUrl + '/images/pecorino.jpg',
      category: 'Fromages',
      tag: 'Fromages à pâte dure',
      unit: 'gramme',
    });

    const poivreNoir = this.alimentRepository.create({
      title: 'Poivre noir',
      description: 'Poivre noir',
      price: 3,
      image: apiUrl + '/images/poivre-noir.jpg',
      category: 'Épices',
      tag: 'Poivre',
      unit: 'gramme',
    });

    const pouletEntier = this.alimentRepository.create({
      title: 'Poulet entier',
      description: 'Poulet entier',
      price: 20,
      image: apiUrl + '/images/poulet.jpg',
      category: 'Viande',
      tag: 'Volaille',
      unit: 'unité',
    });

    const herbesAromatiques = this.alimentRepository.create({
      title: 'Herbes aromatiques',
      description: 'Herbes aromatiques',
      price: 8,
      image: apiUrl + '/images/herbes-aromatiques.jpg',
      category: 'Épices',
      tag: 'Herbes',
      unit: 'bouquet',
    });

    const sel = this.alimentRepository.create({
      title: 'Sel',
      description: 'Sel de table',
      price: 2,
      image: apiUrl + '/images/sel.jpg',
      category: 'Condiments',
      tag: 'Sel',
      unit: 'gramme',
    });

    const aubergine = this.alimentRepository.create({
      title: 'Aubergine',
      description: 'Aubergine',
      price: 4,
      image: apiUrl + '/images/aubergine.jpg',
      category: 'Légumes',
      tag: 'Légumes violets',
      unit: 'unité',
    });

    const courgette = this.alimentRepository.create({
      title: 'Courgette',
      description: 'Courgette',
      price: 3,
      image: apiUrl + '/images/courgette.jpg',
      category: 'Légumes',
      tag: 'Légumes verts',
      unit: 'unité',
    });

    const poivron = this.alimentRepository.create({
      title: 'Poivron',
      description: 'Poivron',
      price: 5,
      image: apiUrl + '/images/poivron.jpg',
      category: 'Légumes',
      tag: 'Légumes rouges',
      unit: 'unité',
    });

    const tomates = this.alimentRepository.create({
      title: 'Tomates',
      description: 'Tomates',
      price: 4,
      image: apiUrl + '/images/tomates.jpg',
      category: 'Légumes',
      tag: 'Légumes rouges',
      unit: 'unité',
    });

    const oignon = this.alimentRepository.create({
      title: 'Oignon',
      description: 'Oignon',
      price: 2,
      image: apiUrl + '/images/oignon.jpg',
      category: 'Légumes',
      tag: 'Légumes blancs',
      unit: 'unité',
    });

    const ail = this.alimentRepository.create({
      title: 'Ail',
      description: 'Ail',
      price: 1,
      image: apiUrl + '/images/ail.jpg',
      category: 'Épices',
      tag: 'Ail',
      unit: 'tête',
    });

    const pommesDeTerre = this.alimentRepository.create({
      title: 'Pommes de terre',
      description: 'Pommes de terre',
      price: 3,
      image: apiUrl + '/images/pommes-de-terre.jpg',
      category: 'Légumes',
      tag: 'Légumes racines',
      unit: 'unité',
    });

    const pommes = this.alimentRepository.create({
      title: 'Pommes',
      description: 'Pommes',
      price: 6,
      image: apiUrl + '/images/pommes.jpg',
      category: 'Fruits',
      tag: 'Fruits rouges',
      unit: 'unité',
    });

    const farine = this.alimentRepository.create({
      title: 'Farine',
      description: 'Farine de blé',
      price: 3,
      image: apiUrl + '/images/farine.jpg',
      category: 'Féculents',
      tag: 'Farine',
      unit: 'gramme',
    });

    const beurre = this.alimentRepository.create({
      title: 'Beurre',
      description: 'Beurre doux',
      price: 5,
      image: apiUrl + '/images/beurre.jpg',
      category: 'Produits laitiers',
      tag: 'Beurre',
      unit: 'gramme',
    });

    const sucre = this.alimentRepository.create({
      title: 'Sucre',
      description: 'Sucre blanc',
      price: 2,

      image: apiUrl + '/images/sucre.jpg',
      category: 'Condiments',
      tag: 'Sucre',
      unit: 'gramme',
    });

    const chocolatNoir = this.alimentRepository.create({
      title: 'Chocolat noir',
      description: 'Chocolat noir',
      price: 4,
      image: apiUrl + '/images/chocolat-noir.jpg',
      category: 'Confiserie',
      tag: 'Chocolat',
      unit: 'gramme',
    });

    const cremeFouettee = this.alimentRepository.create({
      title: 'Crème fouettée',
      description: 'Crème fouettée',
      price: 5,
      image: apiUrl + '/images/creme-fouettee.jpg',
      category: 'Produits laitiers',
      tag: 'Crème',
      unit: 'millilitre',
    });

    const sucreGlace = this.alimentRepository.create({
      title: 'Sucre glace',
      description: 'Sucre glace',
      price: 3,
      image: apiUrl + '/images/sucre-glace.jpg',
      category: 'Confiserie',
      tag: 'Sucre',
      unit: 'gramme',
    });

    const lait = this.alimentRepository.create({
      title: 'Lait',
      description: 'Lait entier',
      price: 4,
      image: apiUrl + '/images/lait.jpg',
      category: 'Produits laitiers',
      tag: 'Lait',
      unit: 'millilitre',
    });

    const pateFeuilletee = this.alimentRepository.create({
      title: 'Pâte feuilletée',
      description: 'Pâte feuilletée',
      price: 4,
      image: apiUrl + '/images/pate-feuilletee.jpg',
      category: 'Pâtes',
      tag: 'Pâte',
      unit: 'gramme',
    });

    const jambon = this.alimentRepository.create({
      title: 'Jambon',
      description: 'Jambon blanc',
      price: 6,
      image: apiUrl + '/images/jambon.jpg',
      category: 'Charcuterie',
      tag: 'Jambon',
      unit: 'gramme',
    });

    const penne = this.alimentRepository.create({
      title: 'Penne',
      description: 'Penne',
      price: 3,
      image: apiUrl + '/images/penne.jpg',
      category: 'Pâtes',
      tag: 'Pâtes',
      unit: 'gramme',
    });

    const cremeFraiche = this.alimentRepository.create({
      title: 'Crème fraîche',
      description: 'Crème fraîche',
      price: 4,
      image: apiUrl + '/images/creme-fraiche.jpg',
      category: 'Produits laitiers',
      tag: 'Crème',
      unit: 'millilitre',
    });

    const gruyere = this.alimentRepository.create({
      title: 'Gruyère',
      description: 'Gruyère',
      price: 5,
      image: apiUrl + '/images/gruyere.jpg',
      category: 'Fromages',
      tag: 'Fromages à pâte dure',
      unit: 'gramme',
    });

    const lardons = this.alimentRepository.create({
      title: 'Lardons',
      description: 'Lardons',
      price: 6,
      image: apiUrl + '/images/lardons.jpg',
      category: 'Charcuterie',
      tag: 'Lardons',
      unit: 'gramme',
    });

    const fromage = this.alimentRepository.create({
      title: 'Fromage',
      description: 'Fromage',
      price: 5,
      image: apiUrl + '/images/fromage.jpg',
      category: 'Fromages',
      tag: 'Fromages à pâte dure',
      unit: 'gramme',
    });

    const pain = this.alimentRepository.create({
      title: 'Pain',
      description: 'Pain',
      price: 3,
      image: apiUrl + '/images/pain.jpg',
      category: 'Pain',
      tag: 'Pain',
      unit: 'gramme',
    });

    const salade = this.alimentRepository.create({
      title: 'Salade',
      description: 'Salade',
      price: 4,
      image: apiUrl + '/images/salade.jpg',
      category: 'Légumes',
      tag: 'Légumes verts',
      unit: 'gramme',
    });

    const pesto = this.alimentRepository.create({
      title: 'Pesto',
      description: 'Pesto',
      price: 5,
      image: apiUrl + '/images/pesto.jpg',
      category: 'Sauces',
      tag: 'Sauces',
      unit: 'gramme',
    });

    await this.alimentRepository.save([
      pommeVerte,
      banane,
      orange,
      boiteHaricotVert,
      boiteMais,
      boitePetitPois,
      boiteCarotte,
      boiteTomate,
      steakHache,
      pancetta,
      oeufs,
      fromagePecorino,
      poivreNoir,
      pouletEntier,
      herbesAromatiques,
      sel,
      aubergine,
      courgette,
      poivron,
      tomates,
      oignon,
      ail,
      pommesDeTerre,
      pommes,
      farine,
      beurre,
      sucre,
      chocolatNoir,
      cremeFouettee,
      sucreGlace,
      lait,
      pateFeuilletee,
      jambon,
      penne,
      cremeFraiche,
      gruyere,
      lardons,
      fromage,
      pain,
      salade,
      pesto,
    ]);
  }

  async seedUstensiles(): Promise<void> {
    const ustensile1 = this.ustensileRepository.create({ title: 'Couteau' });
    const ustensile2 = this.ustensileRepository.create({ title: 'Fourchette' });
    const ustensile3 = this.ustensileRepository.create({ title: 'Cuillère' });
    const ustensile4 = this.ustensileRepository.create({ title: 'Poêle' });
    const ustensile5 = this.ustensileRepository.create({ title: 'Casserole' });
    const ustensile6 = this.ustensileRepository.create({ title: 'Plat' });
    const ustensile7 = this.ustensileRepository.create({ title: 'Assiette' });
    const ustensile8 = this.ustensileRepository.create({ title: 'Verre' });

    await this.ustensileRepository.save([
      ustensile1,
      ustensile2,
      ustensile3,
      ustensile4,
      ustensile5,
      ustensile6,
      ustensile7,
      ustensile8,
    ]);
  }

  async seedRecipes2(): Promise<void> {
    //seed ustensile
    const ustensile1 = this.ustensileRepository.create({ title: 'Couteau' });
    const ustensile2 = this.ustensileRepository.create({ title: 'Fourchette' });
    const ustensile3 = this.ustensileRepository.create({ title: 'Cuillère' });
    const ustensile4 = this.ustensileRepository.create({ title: 'Poêle' });
    const ustensile5 = this.ustensileRepository.create({ title: 'Casserole' });
    const ustensile6 = this.ustensileRepository.create({ title: 'Plat' });
    const ustensile7 = this.ustensileRepository.create({ title: 'Assiette' });
    const ustensile8 = this.ustensileRepository.create({ title: 'Verre' });

    await this.ustensileRepository.save([
      ustensile1,
      ustensile2,
      ustensile3,
      ustensile4,
      ustensile5,
      ustensile6,
      ustensile7,
      ustensile8,
    ]);

    const burgerImage = readFileSync(join(imageFolderPath, 'burger.jpg'));
    const crepImage = readFileSync(join(imageFolderPath, 'crep.jpg'));
    const pateboloImage = readFileSync(join(imageFolderPath, 'bolognaise.jpg'));
    const patecarboImage = readFileSync(join(imageFolderPath, 'patecarbo.jpg'));
    const patopestoImage = readFileSync(join(imageFolderPath, 'patopesto.jpg'));
    const pizzaImage = readFileSync(join(imageFolderPath, 'pizza.jpg'));
    const ratatouilleImage = readFileSync(
      join(imageFolderPath, 'ratatatata.jpg'),
    );
    const stekfriteImage = readFileSync(join(imageFolderPath, 'stekfrite.jpg'));
    const tartopomImage = readFileSync(
      join(imageFolderPath, 'tarteauxpommes.jpg'),
    );

    const burgerimageid = await this.imageService.createImage(
      'burger.jpeg',
      burgerImage,
    );
    const crepimageid = await this.imageService.createImage(
      'crep.jpeg',
      crepImage,
    );
    const pateboloimageid = await this.imageService.createImage(
      'patebolo.jpeg',
      pateboloImage,
    );
    const patecarboimageid = await this.imageService.createImage(
      'patecarbo.jpeg',
      patecarboImage,
    );
    const patopestoimageid = await this.imageService.createImage(
      'patopesto.jpeg',
      patopestoImage,
    );
    const pizzaimageid = await this.imageService.createImage(
      'pizza.jpeg',
      pizzaImage,
    );
    const ratatouilleimageid = await this.imageService.createImage(
      'ratatatata.jpeg',
      ratatouilleImage,
    );
    const stekfriteimageid = await this.imageService.createImage(
      'stekfrite.jpeg',
      stekfriteImage,
    );
    const tartopomimageid = await this.imageService.createImage(
      'tartopom.jpeg',
      tartopomImage,
    );

    const pateCarbonara = this.recipeRepository.create({
      title: 'Pâtes à la carbonara',
      recipeOfTheDay: false,
      ustensiles: [],
      image: patecarboimageid.id,
    });
    await this.recipeService.addAlimentToSeededRecipes(
      ['Penne', 'Pancetta', 'Oeufs', 'Fromage Pecorino', 'Poivre noir', 'Sel'],
      [200, 100, 2, 50, 5, 5],
      pateCarbonara,
    );
    await this.recipeService.addUstensileToSeededRecipes(
      ['Couteau', 'Casserole', 'Poêle'],
      pateCarbonara,
    );
    await this.recipeService.addDetailsToSeededRecipes(
      [
        {
          title: 'Cuire les pâtes',
          description:
            "Cuire les pâtes dans un grand volume d'eau bouillante salée.",
          time: 600,
        },
        {
          title: 'Faire revenir les oignons et les lardons',
          description:
            "Émincer les oignons et les faire revenir à la poêle. Ajouter les lardons dès qu'ils sont dorés.",
          time: 300,
        },
        {
          title: 'Préparer la sauce',
          description:
            'Dans un saladier, mélanger la crème fraîche, les œufs, le sel, et le poivre.',
          time: 150,
        },
        {
          title: 'Ajouter les lardons à la sauce',
          description:
            "Retirer les lardons du feu dès qu'ils sont dorés et les ajouter à la crème.",
          time: 150,
        },
        {
          title: 'Mélanger les pâtes avec la sauce',
          description:
            'Une fois les pâtes cuites al dente, les égoutter et y incorporer la crème. Remettre sur le feu si nécessaire.',
          time: 150,
        },
        {
          title: 'Servir',
          description:
            'Servir et bon appétit ! Vous pouvez également agrémenter votre plat avec des champignons.',
          time: 0,
        },
      ],
      pateCarbonara,
    );

    const pateBolognaise = this.recipeRepository.create({
      title: 'Pâtes à la bolognaise',
      recipeOfTheDay: false,
      ustensiles: [],
      image: pateboloimageid.id,
    });
    await this.recipeService.addAlimentToSeededRecipes(
      ['Penne', 'Steak haché', 'Boite de tomate', 'Herbes aromatiques'],
      [200, 100, 1, 5],
      pateBolognaise,
    );
    await this.recipeService.addUstensileToSeededRecipes(
      ['Couteau', 'Casserole', 'Poêle'],
      pateBolognaise,
    );
    await this.recipeService.addDetailsToSeededRecipes(
      [
        {
          title: 'Tailler le lard',
          description: 'Tailler le lard en petits dès.',
          time: 150,
        },
        {
          title: 'Faire revenir le lard et les légumes',
          description:
            "Faire revenir le lard avec les légumes dans l'huile d'olive.",
          time: 300,
        },
        {
          title: 'Ajouter la viande',
          description: 'Ajouter la viande de boeuf et la faire colorer.',
          time: 300,
        },
        {
          title: 'Ajouter le vin rouge',
          description: 'Ajouter le vin rouge et laisser évaporer.',
          time: 150,
        },
        {
          title: 'Ajouter la purée de tomates et le bouillon',
          description:
            'Ajouter la purée de tomates et le bouillon de viande, cuire à feu doux pendant au moins deux heures couvercle fermé.',
          time: 7200,
        },
        {
          title: 'Laisser mijoter sans couvercle',
          description:
            'Laisser mijoter sans couvercle 10 minutes avant de servir.',
          time: 600,
        },
      ],
      pateBolognaise,
    );

    const steakFrites = this.recipeRepository.create({
      title: 'Steak frites',
      recipeOfTheDay: false,
      ustensiles: [],
      image: stekfriteimageid.id,
    });
    await this.recipeService.addAlimentToSeededRecipes(
      ['Steak haché', 'Pommes de terre'],
      [100, 200],
      steakFrites,
    );
    await this.recipeService.addUstensileToSeededRecipes(
      ['Couteau', 'Friteuse', 'Poêle'],
      steakFrites,
    );
    await this.recipeService.addDetailsToSeededRecipes(
      [
        {
          title: 'Préparer les ingrédients',
          description:
            "Éplucher et émincer l'oignon, ciseler le persil, mélanger la viande hachée avec l'œuf, le persil, l'oignon et le concentré de tomate, façonner des boulettes.",
          time: 600,
        },
        {
          title: 'Faire cuire les frites',
          description:
            'Faire cuire les frites dans une friteuse à 160°C, puis à 190°C.',
          time: 900,
        },
        {
          title: 'Faire cuire les steaks',
          description:
            "Faire revenir les mini-steaks dans une poêle avec de l'huile d'olive.",
          time: 300,
        },
        {
          title: 'Assembler et servir',
          description:
            'Alterner les "frites" et les steaks sur des piques à brochette. Servir bien chaud.',
          time: 0,
        },
      ],
      steakFrites,
    );

    const ratatouille = this.recipeRepository.create({
      title: 'Ratatouille',
      recipeOfTheDay: false,
      ustensiles: [],
      image: ratatouilleimageid.id,
    });
    await this.recipeService.addAlimentToSeededRecipes(
      ['Tomates', 'Courgette', 'Poivron', 'Oignon', 'Ail'],
      [2, 1, 1, 1, 1],
      ratatouille,
    );
    await this.recipeService.addUstensileToSeededRecipes(
      ['Couteau', 'Poêle'],
      ratatouille,
    );
    await this.recipeService.addDetailsToSeededRecipes(
      [
        {
          title: 'Préparer les légumes',
          description:
            "Couper les tomates en quartiers, les aubergines et courgettes en rondelles, émincer les poivrons en lamelles, et l'oignon en rouelles.",
          time: 300,
        },
        {
          title: 'Faire revenir les oignons et poivrons',
          description:
            "Faire revenir les oignons et poivrons dans de l'huile d'olive.",
          time: 300,
        },
        {
          title: 'Ajouter les autres ingrédients',
          description:
            "Ajouter les tomates, l'ail haché, le thym et le laurier, saler, poivrer, et laisser mijoter doucement à couvert.",
          time: 2700,
        },
        {
          title: 'Ajouter aubergines et courgettes',
          description:
            'Faire cuire les aubergines et courgettes séparemment puis les ajouter au mélange de tomates, prolonger la cuisson.',
          time: 1500,
        },
        {
          title: 'Servir',
          description: 'Servir chaud.',
          time: 0,
        },
      ],
      ratatouille,
    );

    const tarte = this.recipeRepository.create({
      title: 'Tarte aux pommes',
      recipeOfTheDay: false,
      ustensiles: [],
      image: tartopomimageid.id,
    });
    await this.recipeService.addAlimentToSeededRecipes(
      ['Pommes', 'Pâte feuilletée', 'Sucre', 'Beurre'],
      [4, 200, 50, 50],
      tarte,
    );
    await this.recipeService.addUstensileToSeededRecipes(
      ['Couteau', 'Plat', 'Four'],
      tarte,
    );
    await this.recipeService.addDetailsToSeededRecipes(
      [
        {
          title: 'Préparer les pommes',
          description:
            "Éplucher et découper en morceaux 4 Golden, faire une compote avec un peu d'eau et du sucre vanillé.",
          time: 900,
        },
        {
          title: 'Préparer les autres pommes',
          description:
            'Éplucher et couper en lamelles les deux dernières pommes.',
          time: 300,
        },
        {
          title: 'Préchauffer le four',
          description: 'Préchauffer le four à 210°C.',
          time: 600,
        },
        {
          title: 'Étaler la pâte',
          description:
            'Étaler la pâte brisée dans un moule, la piquer avec une fourchette, et verser la compote.',
          time: 300,
        },
        {
          title: 'Disposer les pommes',
          description:
            'Disposer les lamelles de pommes en spirale ou en cercles, ajouter des lamelles de beurre.',
          time: 300,
        },
        {
          title: 'Enfourner',
          description:
            'Enfourner et laisser cuire pendant 30 minutes, surveiller la cuisson.',
          time: 1800,
        },
        {
          title: 'Servir',
          description: 'Servir chaud ou froid.',
          time: 0,
        },
      ],
      tarte,
    );

    const crepe = this.recipeRepository.create({
      title: 'Crêpes',
      recipeOfTheDay: false,
      ustensiles: [],
      image: crepimageid.id,
    });
    await this.recipeService.addAlimentToSeededRecipes(
      ['Farine', 'Oeufs', 'Sucre', 'Lait'],
      [200, 2, 50, 50],
      crepe,
    );
    await this.recipeService.addUstensileToSeededRecipes(
      ['Couteau', 'Poêle'],
      crepe,
    );
    await this.recipeService.addDetailsToSeededRecipes(
      [
        {
          title: 'Préparer la pâte',
          description:
            'Dans un saladier, mélanger la farine, le sel, et le sucre. Faire une fontaine, ajouter les œufs, incorporer la farine, ajouter le beurre fondu, puis le lait par petites quantités.',
          time: 600,
        },
        {
          title: 'Faire cuire les crêpes',
          description: 'Faire cuire les crêpes dans une poêle chaude huilée.',
          time: 300,
        },
        {
          title: 'Servir',
          description: 'Servir avec les garnitures de votre choix.',
          time: 0,
        },
      ],
      crepe,
    );

    const pizza = this.recipeRepository.create({
      title: 'Pizza',
      recipeOfTheDay: false,
      ustensiles: [],
      image: pizzaimageid.id,
    });
    await this.recipeService.addAlimentToSeededRecipes(
      ['Pâte feuilletée', 'Tomates', 'Fromage', 'Jambon'],
      [200, 2, 50, 50],
      pizza,
    );
    await this.recipeService.addUstensileToSeededRecipes(
      ['Couteau', 'Plat', 'Four'],
      pizza,
    );
    await this.recipeService.addDetailsToSeededRecipes(
      [
        {
          title: 'Préparer la pâte',
          description:
            'Verser la farine dans un saladier, ajouter le mélange de levure, sel, et sucre, mélanger et pétrir. Laisser reposer une heure.',
          time: 3600,
        },
        {
          title: 'Étaler la pâte',
          description:
            "Étaler la pâte sur une surface farinée, badigeonner d'huile d'olive, et étaler sur une plaque.",
          time: 300,
        },
        {
          title: 'Ajouter la sauce tomate',
          description: 'Ajouter la sauce tomate sur la pâte.',
          time: 150,
        },
        {
          title: 'Ajouter les ingrédients',
          description: 'Ajouter le fromage et le jambon.',
          time: 150,
        },
        {
          title: 'Enfourner',
          description: 'Enfourner à 220°C pendant 10 minutes.',
          time: 600,
        },
        {
          title: 'Servir',
          description: 'Servir chaud.',
          time: 0,
        },
      ],
      pizza,
    );

    const hamburger = this.recipeRepository.create({
      title: 'Hamburger',
      recipeOfTheDay: false,
      ustensiles: [],
      image: burgerimageid.id,
    });
    await this.recipeService.addAlimentToSeededRecipes(
      ['Steak haché', 'Pain', 'Fromage', 'Salade', 'Tomates'],
      [100, 1, 50, 50, 2],
      hamburger,
    );
    await this.recipeService.addUstensileToSeededRecipes(
      ['Couteau', 'Poêle', 'Friteuse'],
      hamburger,
    );
    await this.recipeService.addDetailsToSeededRecipes(
      [
        {
          title: 'Faire revenir les oignons',
          description: 'Faire revenir les oignons à feu doux.',
          time: 300,
        },
        {
          title: 'Cuire les steaks',
          description:
            'Ajouter les steaks à la poêle, cuire et ajouter une tranche de cheddar sur chaque steak.',
          time: 300,
        },
        {
          title: 'Assembler le hamburger',
          description:
            'Tartiner le pain de ketchup et de moutarde, ajouter le steak avec le fromage, la salade, et les tomates.',
          time: 150,
        },
        {
          title: 'Servir',
          description: "Recouvrir avec l'autre tranche de pain, servir.",
          time: 0,
        },
      ],
      hamburger,
    );

    const patePesto = this.recipeRepository.create({
      title: 'Pâtes au pesto',
      recipeOfTheDay: false,
      ustensiles: [],
      image: patopestoimageid.id,
    });
    await this.recipeService.addAlimentToSeededRecipes(
      ['Penne', 'Pesto'],
      [200, 50],
      patePesto,
    );
    await this.recipeService.addUstensileToSeededRecipes(
      ['Couteau', 'Casserole'],
      patePesto,
    );
    await this.recipeService.addDetailsToSeededRecipes(
      [
        {
          title: 'Cuire les pâtes',
          description: 'Faire cuire les pâtes al dente.',
          time: 600,
        },
        {
          title: 'Préparer le pesto',
          description:
            "Dans un mortier, piler le basilic avec l'ail et les pignons, ajouter l'huile peu à peu en fouettant, puis ajouter les fromages râpés et assaisonner.",
          time: 450,
        },
        {
          title: 'Mélanger les pâtes avec le pesto',
          description: 'Égoutter les pâtes, les mélanger avec le pesto.',
          time: 150,
        },
        {
          title: 'Servir',
          description: 'Servir chaud.',
          time: 0,
        },
      ],
      patePesto,
    );

    await this.recipeRepository.save([
      pateCarbonara,
      pateBolognaise,
      steakFrites,
      ratatouille,
      tarte,
      crepe,
      pizza,
      hamburger,
      patePesto,
    ]);
  }

  async seedAllergies(): Promise<void> {
    const allergy1 = this.allergyRepository.create({ title: 'Lait' });
    const allergy2 = this.allergyRepository.create({ title: 'Noix' });
    const allergy3 = this.allergyRepository.create({ title: 'Puce de lit' });

    await this.allergyRepository.save([allergy1, allergy2, allergy3]);
  }

  async seedDiets(): Promise<void> {
    const diet1 = this.dietRepository.create({ title: 'Végétarien' });
    const diet2 = this.dietRepository.create({ title: 'Végétalien' });
    const diet3 = this.dietRepository.create({ title: 'Cétogène' });

    await this.dietRepository.save([diet1, diet2, diet3]);
  }

  async seedQuizzes(): Promise<void> {
    const quiz1 = this.quizzRepository.create({
      title: 'Faites-vous souvent la cuisine ?',
      choices: [
        'Tout le temps',
        'Souvent',
        'Occasionnellement',
        'Rarement',
        'Jamais',
      ],
    });
    const quiz2 = this.quizzRepository.create({
      title: 'Avez-vous du temps pour faire la cuisine ?',
      choices: ['Beaucoup de temps', 'Assez de temps', 'Peu de temps'],
    });
    const quiz3 = this.quizzRepository.create({
      title: 'Vous préférez les plats sucrés ou salés ?',
      choices: ['Sucré', 'Salé', 'Les deux'],
    });
    const quiz4 = this.quizzRepository.create({
      title: 'Aimez-vous les fruits de mer ?',
      choices: ['Oui', 'Pas spécialement', 'Pas du tout'],
    });
    const quiz5 = this.quizzRepository.create({
      title: "Vous mangez plutôt dehors ou à l'intérieur ?",
      choices: [
        'Je mange tout le temps chez moi',
        'Je mange souvent chez moi',
        'Je mange rarement chez moi',
        'Je mange tout le temps dehors',
      ],
    });
    const quiz6 = this.quizzRepository.create({
      title: 'Les fruits et légumes ne vous font pas peur ?',
      choices: ['Jadore ça !', 'Pas plus que ça', 'Je déteste'],
    });
    const quiz7 = this.quizzRepository.create({
      title: 'Vous aimez découvrir des nouveaux plats ?',
      choices: [
        'Oui je suis curieux !',
        'Jaime découvrir des nouveaux plats de temps en temps',
        'Je préfère manger les mêmes plats',
      ],
    });

    await this.quizzRepository.save([
      quiz1,
      quiz2,
      quiz3,
      quiz4,
      quiz5,
      quiz6,
      quiz7,
    ]);
  }

  async seedUsers(): Promise<void> {
    const ppMateo = readFileSync(join(imageFolderPath, 'Bebe.jpeg'));
    const ppMateoId = await this.imageService.createImage('Bebe.jpeg', ppMateo);
    const ppTristan = readFileSync(join(imageFolderPath, 'ppTristan.png'));
    const ppTristanId = await this.imageService.createImage(
      'ppTristan.png',
      ppTristan,
    );

    const calendar1: calendar_entity = new calendar_entity();
    calendar1.title = 'calendrier tristan';
    const calendar2: calendar_entity = new calendar_entity();
    calendar2.title = 'calendrier maeto';
    const calendar3: calendar_entity = new calendar_entity();
    calendar3.title = 'calendrier henry';
    await this.calendarRepository.save([calendar1, calendar2, calendar3]);

    const userMateo = this.userRepository.create({
      email: 'mateoabribat@orange.fr',
      username: 'mateolesoufrifredetristan',
      password: 'Test1234!',
      firstname: 'Mateo',
      lastname: 'EsclaveDeTristan',
      image: ppMateoId.id,
      isSubcribed: true,
      verified: true,
      fcmToken: '',
    });
    userMateo.calendar = calendar2;

    const userTristan = this.userRepository.create({
      email: 'gory.tristan92@gmail.com',
      username: 'tristanus',
      password: 'titan00000&',
      firstname: 'Tristan',
      lastname: 'LeGrand',
      image: ppTristanId.id,
      isSubcribed: true,
    });
    userTristan.calendar = calendar1;

    const userHenry = this.userRepository.create({
      email: 'chanh-long-henry.nguyen@epitech.eu',
      username: 'henryEsclaveDeTristan',
      password: 'Azerty123!',
      firstname: 'Henry',
      lastname: 'EsclaveDeTristan',
      image: '',
      isSubcribed: true,
    });
    userHenry.calendar = calendar3;
    await this.userRepository.save([userMateo, userTristan, userHenry]);
    calendar1.user = userTristan;
    calendar2.user = userMateo;
    calendar3.user = userHenry;
    await this.calendarRepository.save([calendar1, calendar2, calendar3]);
  }
}
