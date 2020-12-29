import { validInput } from '../src/client/js/validInput'

describe("Testing the input is not empty ", () => {
    test("Testing the validInput() function", () => {
       
        const location = "";
        const date ="";
        
        expect(validInput(location,date)).toBe(false);
    })
});

