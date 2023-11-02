import wordExists from 'word-exists';

export default class WordChecker {
    
    async isWordValid(word) {
        return await wordExists(word); 
    }
  
  }

  