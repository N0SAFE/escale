import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Rule from 'App/Models/Rule'

export default class RuleSeeder extends BaseSeeder {
  public async run () {
    await Rule.createMany([
      {
        rule: 'Pas de bruits de nature à gêner les voisins',
      },
      {
        rule: 'Ne pas communiquer vos codes d\'entrée à quiconque',
      },
      {
        rule: 'Interdiction de fumer (y compris la chicha) dans le logement',
      },
      {
        rule: 'Interdiction de manger dans l\'espace Bien-être (Jacuzzi, Sauna, ...)',
      },
      {
        rule: 'Interdiction de venir plus nombreux que le nombre indiqué lors de la réservation',
      },
      {
        rule: 'Interdiction aux mineurs pour des raisons de sécurité',
      },
      {
        rule: 'Interdiction de ramener des animaux',
      },
      {
        rule: 'Utilisation d\'Internet en respectant les lois Hadopi.',
      },
      {
        rule: 'Ne pas utiliser de gel douche (ou très peu), pouvant à terme abîmer la baignoire balnéothérapie.',
      },
      {
        rule: 'Interdiction d\'utiliser des huiles essentielles, pouvant endommager irrémédiablement la baignoire.',
      },
    ])
  }
}
