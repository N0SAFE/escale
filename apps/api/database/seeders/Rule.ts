import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Rule from 'App/Models/Rule'

export default class RuleSeeder extends BaseSeeder {
  public async run () {
    await Rule.createMany([
      {
        rule: 'Ne communiquer à personne vos codes d\'accès',
      },
      {
        rule: 'Merci d\'enlever vos chaussures lorsque vous entrez dans la suite',
      },
      {
        rule: `Merci de ne pas fumer, vapoter dans la suite ( y compris la chicha)
une terrasse est à votre disposition pour cela`,
      },
      {
        rule: 'La douche est obligatoire avant l\'utilisation du spa',
      },
      {
        rule: 'Nous signaler tous problèmes que vous êtes susceptible de rencontrer',
      },
      {
        rule: 'Le logement est équipé d\'une TV rotative, merci de la manipuler délicatement',
      },
      {
        rule: 'Merci de ne pas manger dans l\'espace bien-être mais dans l\'espace prévu à cet effet',
      },
      {
        rule: 'Eteindre tous les appareils et lumière lorsque vous quittez la suite',
      },
      {
        rule: 'Veillez à bien fermer toutes les fenêtres et la porte d\'entrée lorsque vous quittez la suite',
      },
      {
        rule: 'L\'accès à la suite est limité à 2 personnes et est interdit aux mineurs',
      },
      {
        rule: 'L\'accès à la suite est interdit aux animaux',
      },
      {
        rule: 'Merci de ne pas faire de bruits qui pourrait déranger le voisinage',
      },
    ])
  }
}
