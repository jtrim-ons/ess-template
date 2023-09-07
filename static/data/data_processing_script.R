library(tidyverse)
library(readxl)
library(stringr)

config_indicators <- read_csv("./config-data/config-indicators.csv")
areas <- read_csv("./config-data/areas.csv")

latest_year_data <- data.frame(areacd=character(),
                                code=character(),
                                year=double(),
                                value=double(), 
                                stringsAsFactors=FALSE)

created_files_log <- data.frame(code=character(),
                                type=character(),
                                stringsAsFactors=FALSE)

for (row in 1:nrow(config_indicators)) {
  
  if (is.na(config_indicators[row, "label"]$label)) {
    
    config_indicators[row, "label"] <- str_to_sentence(str_replace_all(config_indicators[row, "code"], "_", " "))
  }
  
  indicator_code <- config_indicators[row, "code"]$code

  indicator_data <- read_csv(paste0("./csv-preprocess/", indicator_code ,".csv"))
  
  indicator_data <- indicator_data %>%
    filter(areacd %in% areas$areacd)
  
  list_of_years <- as.numeric(unlist(colnames(indicator_data)[-1]))
  latest_year <- max(list_of_years)
  config_indicators[row, "latestYear"] <- latest_year
  
  default_initial_year <- as.numeric(config_indicators[row, "defaultInitialYear"])
  
  flattened_indicator_data <- indicator_data %>%
    pivot_longer(!areacd , names_to = "year", values_to = "value") %>%
    filter(is.numeric(as.numeric(value))) %>%
    filter(value != "na") %>%
    filter(!is.na(value))
    
  indicator_latest_year_data <- flattened_indicator_data %>%
    filter(year == latest_year) %>%
    mutate(codeId = config_indicators[row, "id"]$id)
  
  latest_year_data <- rbind(latest_year_data, indicator_latest_year_data)
  
  indicator_initial_year_data <- flattened_indicator_data %>%
    filter(year == default_initial_year)
  
  if (nrow(indicator_initial_year_data) > 0) {
    
    created_files_log <- created_files_log %>%
      add_row(code=indicator_code, type="initial")
  
    write.csv(indicator_initial_year_data, paste0("./csv/initial-year/",indicator_code,".csv"), row.names = FALSE)
    
  }
  
  indicator_other_year_data <- flattened_indicator_data %>%
    filter(!year %in% c(latest_year, default_initial_year))
  
  if (nrow(indicator_other_year_data) > 0) {
    
    created_files_log <- created_files_log %>%
      add_row(code=indicator_code, type="other")

    write.csv(indicator_other_year_data, paste0("./csv/other-years/",indicator_code,".csv"), row.names = FALSE)
    
  }

}

write.csv(latest_year_data, "./csv/latest-year/data.csv", row.names = FALSE)
#write.csv(config_indicators, "./config-data/config-indicators.csv", row.names = FALSE, na="")
write.csv(created_files_log, "./config-data/datasets-log.csv", row.names = FALSE)

#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
