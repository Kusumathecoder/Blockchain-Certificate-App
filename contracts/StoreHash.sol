// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract StoreHash {
  struct Certificate {
    string ID;
    string name;
    string course;
  }
  mapping(string => Certificate) public certificate_to_ID;
  Certificate[] public certificates;
  function add_certificate(string memory _student_name, string memory course, string memory ID) public {
        Certificate memory newcertificate = Certificate({
            name: _student_name,
            course: course,
            ID: ID
        });
        certificates.push(newcertificate);
        certificate_to_ID[ID] = newcertificate;
  }

  // function check_certificate(uint256 number) external view returns (Certificate memory) {
  //   return  timestamp_to_certificate[number];
  // }

}