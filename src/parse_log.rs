use serde_json::{self};
use state::{Storage};
use std::{fs::{self, ReadDir}, sync::RwLock, collections::HashMap, path::Path};

use crate::lib::structures::{TFullState, LogUsers, RankedLogUsers, RankedLogUser};

pub static FULL_SERVER_STATE: Storage<RwLock<TFullState>> = Storage::new(); // creates a static variable, which will be given to the routes.rs sercvice


fn rank_users(state:LogUsers, file_name:&String) -> RankedLogUsers{
    /// This function ranks each user by how much experience he gathered
    let mut sorted_state_vec: Vec<_> = state.0.iter().collect();
    sorted_state_vec.sort_by(|a,b| b.1.name.cmp(&a.1.name));
    sorted_state_vec.sort_by(|a,b| b.1.experience.cmp(&a.1.experience));
    let mut rank = 1;
    let mut ranked_users:RankedLogUsers = RankedLogUsers{
        log_name: file_name.to_string(),
        updated_at: chrono::Utc::now().timestamp(),
        users: vec![]
    };
    for log_user in sorted_state_vec {
        
        let user = log_user.1;
        if !(user.level <= 5) {
        let full_user = RankedLogUser{
            id: user.id,
            name: user.name.to_string(),
            experience: user.experience, 
            level: user.level,
            rank: rank
        };
        ranked_users.users.push(full_user);
        
       rank+=1;
    }}
    return ranked_users;

    }





fn parse_files_to_object(server_jsons: ReadDir){
    /// This function reads all logs and puts them in a HashMap
    let mut full_state:HashMap<String, RankedLogUsers>= HashMap::new();
    for file in server_jsons{
        let file_path = &file.unwrap().path();
        let server_data:String = fs::read_to_string(file_path).expect("Unable to read file");

        let state: LogUsers =serde_json::from_str(&server_data).unwrap_or_default(); 
        let mut file_name= Path::new(&file_path).file_name().unwrap().to_str().unwrap().to_string();
        file_name.truncate(file_name.len()-5);

        let ranked_state:RankedLogUsers= rank_users(state, &file_name);
        full_state.insert(file_name, ranked_state); 
        }
    FULL_SERVER_STATE.set(RwLock::new(TFullState(full_state.clone()))); // does not panic in threads so can be set here in loop
    
    /// This overwrites the global static which will be ran in every loop
    let mut new_full_state = FULL_SERVER_STATE.get().try_write().unwrap();
    *new_full_state = TFullState(full_state.clone());
        }


pub fn parse_log(log_path: String) {
    let log_paths = fs::read_dir(log_path).unwrap();
    parse_files_to_object(log_paths);
    //println!("lol{:#?}",FULL_SERVER_STATE.get().read().unwrap());
}