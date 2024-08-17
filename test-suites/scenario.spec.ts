import fs from 'fs';
import AaveConfig from '@aave/deploy-v3/dist/markets/test';
import { configuration as actionsConfiguration } from './helpers/actions';
import { configuration as calculationsConfiguration } from './helpers/utils/calculations';
import { makeSuite } from './helpers/make-suite';
import { executeStory } from './helpers/scenario-engine';

const scenarioFolder = './test-suites/helpers/scenarios/';

// borrow-negatives.json, borrow-repay-stable.json
// borrow-repayWithPermit-variable.json
// set-use-as-collateral.json, withdraw-negatives.json
// borrow-repay-stable-edge.json, borrow-repay-variable.json
// credit-delegation.json
// rebalance-stable-rate.json, swap-rate-mode.json,

// deposit.json withdraw

const selectedScenarios: string[] = ['deposit.json']; //"borrow-repay-stable-edge.json", "borrow-repay-stable.json"];

fs.readdirSync(scenarioFolder).forEach((file) => {
  if (selectedScenarios.length > 0 && !selectedScenarios.includes(file)) return;

  const scenario = require(`./helpers/scenarios/${file}`);

  makeSuite(scenario.title, async (testEnv) => {
    before('Initializing configuration', async () => {
      actionsConfiguration.skipIntegrityCheck = false; //set this to true to execute solidity-coverage

      calculationsConfiguration.reservesParams = AaveConfig.ReservesConfig;
    });

    for (const story of scenario.stories) {
      it(story.description, async function () {
        // Retry the test scenarios up to 4 times in case random HEVM network errors happen
        //this.retries(4);
        await executeStory(story, testEnv);
      });
    }
  });
});
