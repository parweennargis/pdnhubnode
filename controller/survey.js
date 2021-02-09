module.exports = {
    survey: (req, res) => { res.render('survey'); },

    calculation: (req, res) => {
        console.log('test');
        const totalspend = req.body.totalspend;
        const slider1 = req.body.slider1;
        const slider2 = req.body.slider2;
        const slider3 = req.body.slider3;
        const slider4 = req.body.slider4;
        const slider5 = req.body.slider5;
        const currently_under_contract = req.body.currently_under_contract;
        const exclusive_contract_position = req.body.exclusive_contract_position;

        const result = calculateData(totalspend, slider1, slider2, slider3, slider4, slider5, currently_under_contract, exclusive_contract_position);

        console.log(result);
        return res.render('result', { message: result[0], competitiveness: result[1], easeofchange: result[2], finalCalculation: result[3] });
    },

    redirectUserToSurvey: (req, res) => { res.redirect('/survey'); },
};

function calculateData(totalspend, slider1, slider2, slider3, slider4, slider5, currently_under_contract, exclusive_contract_position) {
    const max_saving = 0.6;  //Maximum you could ever save
    const competitiveness = 100;  //Competitiveness of the market place for this category
    const time_since_let_limit = 33;  //e.g. after 33 % on slider value = 100
    const number_of_suppliers = 3;  //Number of suppliers that have no impact at all
    const effect_of_many_suppliers = 0.95;  // if greater than 3 suppliers then reduce savings to  what percentage e.g. 95%

    const calc_competitiveness = (competitiveness + slider2) / 2;
    const calc_ease_of_change = slider3; // no change just use slider value
    const calc_how_tight = 50 + (slider4 / 2);
    let calc_time_since_let = 0;
    if (slider5 > time_since_let_limit) {
        calc_time_since_let = 100;
    } else {
        calc_time_since_let = (slider5 / time_since_let_limit) * 100;
    }

    const calc_max_saving = totalspend * max_saving;
    const calc_avg_competitive_and_ease_of_change = (calc_competitiveness + calc_ease_of_change) / 2;
    const calc_saving_after_averages = (calc_max_saving * calc_avg_competitive_and_ease_of_change) / 100;
    const calc_saving_after_time = (calc_saving_after_averages * calc_time_since_let) / 100;
    const calc_saving_after_tightmanage = (calc_saving_after_time * calc_how_tight) / 100;

    //calc_final is what is displayed as the potential saving
    let calc_final = 0;
    if (slider1 > 33) {
        calc_final = calc_saving_after_tightmanage * effect_of_many_suppliers;
    } else {
        calc_final = Math.round(calc_saving_after_tightmanage);
    }
    if (currently_under_contract == "Yes") calc_final = 0;

    if (exclusive_contract_position == "Yes") calc_final = 0;


    // GRAPH 1
    // x competitiveness
    const x = parseInt(slider2);
    //y ease of change
    const y = parseInt(slider3);
    let message = 'In assessing the supply of Stationery as Critical because of a lack of competitiveness in the market is incorrect and wider market engagement should be considered, as well ans ensuring the nature of your requirements is not too specific or specialised.';

    if (x > 50 && y <= 50) {
        message = 'Your answers place the supply of stationery in the Strategic Quadrant of The Kraljic Matrix.This is unusual and could be because your company has stationery as a direct category of spend.';
    } else if (x > 50 && y >= 50) {
        message = 'Stationery spend has been assessed by you and your team and the savings estimated accordingly';
    } else if (x < 50 && y >= 50) {
        message = 'The Stationery spend has been assessed as Acquisition in nature because your company requirements are not aggregated so this activity should be carried out to deliver additional savings';
    }

    return [message, x, y, Math.round(calc_final)];
}