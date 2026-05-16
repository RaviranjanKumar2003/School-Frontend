//package com.example.stud_erp.service.Implementation;
//
//import com.example.stud_erp.entity.ClassEntity;
//import com.example.stud_erp.entity.Student;
//import com.example.stud_erp.payload.LoginRequest;
//import com.example.stud_erp.payload.LoginResponse;
//import com.example.stud_erp.payload.StudentDto;
//import com.example.stud_erp.repository.ClassRepository;
//import com.example.stud_erp.repository.StudentRepository;
//import com.example.stud_erp.service.ImageService;
//import com.example.stud_erp.service.StudentService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardCopyOption;
//import java.time.Year;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//public class StudentServiceImpl implements StudentService {
//
//    @Autowired
//    private StudentRepository studentRepository;
//
//    @Autowired
//    private ClassRepository classRepository;
//
//    @Autowired
//    private ImageService imageService;
//
//
//    // ================= CREATE =================
//    @Override
//    public Student createStudent(
//            Student student,
//            MultipartFile image
//    ) throws IOException, IOException {
//
//        // ================= EMAIL VALIDATION =================
//        if (student.getEmail() == null ||
//                student.getEmail().trim().isEmpty()) {
//
//            throw new RuntimeException("Email required");
//        }
//
//        // LOWERCASE EMAIL
//        student.setEmail(
//                student.getEmail().trim().toLowerCase()
//        );
//
//        // ================= DUPLICATE EMAIL =================
//        if (studentRepository.existsByEmail(student.getEmail())) {
//
//            throw new RuntimeException("Email already exists");
//        }
//
//        // ================= PHONE VALIDATION =================
//        if (student.getStudPhoneNumber() == null ||
//                student.getStudPhoneNumber().length() < 10) {
//
//            throw new RuntimeException("Valid phone number required");
//        }
//
//        // ================= CLASS FETCH =================
//        ClassEntity cls = classRepository
//                .findById(student.getClassNumber())
//                .orElseThrow(() ->
//                        new RuntimeException("Class not found")
//                );
//
//        // ================= SET CLASS NAME =================
//        student.setClassName(cls.getClassName());
//
//        // ================= AUTO STUDENT ID =================
//        String regNo =
//                "SCH-"
//                        + Year.now().getValue()
//                        + "-"
//                        + System.currentTimeMillis();
//
//        student.setStudentId(regNo);
//
//        // ================= AUTO USERNAME =================
//        String username =
//                student.getEmail()
//                        .split("@")[0]
//                        + "_"
//                        + cls.getClassName()
//                        .replaceAll("\\s+", "")
//                        .toLowerCase();
//
//        student.setUsername(username);
//
//        // ================= AUTO PASSWORD =================
//        String password =
//                "STUD@"
//                        + student.getStudPhoneNumber().substring(
//                        student.getStudPhoneNumber().length() - 4
//                );
//
//        student.setPassword(password);
//
//        // ================= AUTO ROLL NUMBER =================
//
//        Long totalStudents =
//                studentRepository.countByClassNumber(
//                        student.getClassNumber()
//                );
//
//        Long nextRollNo = totalStudents + 1;
//
//        student.setStudRollNo(nextRollNo);
//
//        // ================= IMAGE UPLOAD =================
//        if (image != null && !image.isEmpty()) {
//
//            String imageUrl =
//                    imageService.uploadImage(image);
//
//            student.setImageUrl(imageUrl);
//        }
//
//        // ================= DEFAULT DELETE FLAG =================
//        student.setDeleted(false);
//
//        // ================= SAVE =================
//        return studentRepository.save(student);
//    }
//
//    // ================= UPDATE =================
//    @Override
//    public Student updateStudent(
//
//            Long id,
//
//            Student updatedStudent,
//
//            MultipartFile image
//
//    ) throws IOException {
//
//        Student student =
//                studentRepository.findById(id)
//                        .orElseThrow(() ->
//                                new RuntimeException(
//                                        "Student not found"
//                                )
//                        );
//
//        // ================= UPDATE FIELDS =================
//
//        student.setStudName(
//                updatedStudent.getStudName()
//        );
//
//        student.setStudLastName(
//                updatedStudent.getStudLastName()
//        );
//
//        student.setEmail(
//                updatedStudent.getEmail()
//        );
//
//        student.setStudPhoneNumber(
//                updatedStudent.getStudPhoneNumber()
//        );
//
//        student.setClassNumber(
//                updatedStudent.getClassNumber()
//        );
//
//        student.setStudRollNo(
//                updatedStudent.getStudRollNo()
//        );
//
//        // ================= IMAGE =================
//
//        if (
//                image != null &&
//                        !image.isEmpty()
//        ) {
//
//            String fileName =
//                    UUID.randomUUID()
//                            + "_"
//                            + image.getOriginalFilename();
//
//            Path uploadPath =
//                    Paths.get(
//                            "uploads/students"
//                    );
//
//            if (
//                    !Files.exists(uploadPath)
//            ) {
//
//                Files.createDirectories(
//                        uploadPath
//                );
//            }
//
//            Files.copy(
//                    image.getInputStream(),
//
//                    uploadPath.resolve(fileName),
//
//                    StandardCopyOption.REPLACE_EXISTING
//            );
//
//            student.setImageUrl(fileName);
//        }
//
//        return studentRepository.save(student);
//    }
//
//    // ================= DELETE =================
//    @Override
//    public void deleteStudent(Long id) {
//
//        Student st = studentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        st.setDeleted(true);
//
//        studentRepository.save(st);
//    }
//
//    // ================= GET ALL =================
//    @Override
//    public List<StudentDto> getAllStudents(Long schoolId) {
//
//        return studentRepository
//                .findBySchoolIdAndIsDeletedFalse(schoolId)
//                .stream()
//                .map(this::toDTO)
//                .toList();
//    }
//
//    // ================= CLASS WISE =================
//    @Override
//    public List<StudentDto> getStudentsByClass(Long schoolId, Long classNumber) {
//
//        return studentRepository
//                .findBySchoolIdAndClassNumberAndIsDeletedFalse(schoolId, classNumber)
//                .stream()
//                .map(this::toDTO)
//                .toList();
//    }
//
//    // ================= GET BY ID =================
//    @Override
//    public Optional<Student> getStudentById(Long id) {
//        return studentRepository.findById(id);
//    }
//
//    @Override
//    public Optional<Student> getByStudentId(String studentId) {
//        return studentRepository.findByStudentId(studentId);
//    }
//
//    // ================= DTO MAPPER =================
//    private StudentDto toDTO(Student s) {
//
//        StudentDto dto = new StudentDto();
//
//        dto.setId(s.getId());
//
//        dto.setSchoolId(s.getSchoolId());
//        dto.setSchoolCode(s.getSchoolCode());
//        dto.setSchoolName(s.getSchoolName());
//
//        dto.setStudentId(s.getStudentId());
//        dto.setUsername(s.getUsername());
//        dto.setEmail(s.getEmail());
//
//        dto.setClassNumber(s.getClassNumber());
//        dto.setClassName(s.getClassName());
//
//        dto.setStudRollNo(s.getStudRollNo());
//        dto.setStudName(s.getStudName());
//        dto.setStudPhoneNumber(s.getStudPhoneNumber());
//
//        dto.setImageUrl(s.getImageUrl());
//
//        return dto;
//    }
//
//
//    // ================= LOGIN =================
//    @Override
//    public LoginResponse authenticateUser(LoginRequest request) {
//
//        Student student = studentRepository
//                .findByUsername(request.getUsername())
//
//                .orElseThrow(() ->
//                        new RuntimeException("Student not found")
//                );
//
//        if (!student.getPassword().equals(request.getPassword())) {
//
//            throw new RuntimeException("Invalid password");
//        }
//
//        // ================= RESPONSE =================
//        LoginResponse response = new LoginResponse();
//
//        response.setId(student.getId());
//
//        response.setName(student.getStudName());
//
//        response.setUsername(student.getUsername());
//
//        response.setEmail(student.getEmail());
//
//        response.setRole("STUDENT");
//
//        response.setSchoolId(student.getSchoolId());
//
//        response.setSchoolName(student.getSchoolName());
//
//        response.setSchoolCode(student.getSchoolCode());
//
//        return response;
//    }
//
//    // ================= TOTAL STUDENTS =================
//    @Override
//    public Long getTotalStudents(Long schoolId) {
//
//        return studentRepository
//                .countBySchoolIdAndIsDeletedFalse(schoolId);
//    }
//
//
//    @Override
//    public Student getById(Long id) {
//
//        return studentRepository.findById(id)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "Student not found"
//                        )
//                );
//    }
//
//
//    @Override
//    public List<StudentDto> getDeletedStudents(Long schoolId) {
//
//        return studentRepository.findBySchoolIdAndIsDeletedTrue(schoolId)
//                .stream()
//                .map(s -> {
//                    StudentDto dto = new StudentDto();
//                    dto.setId(s.getId());
//                    dto.setStudName(s.getStudName());
//                    dto.setEmail(s.getEmail());
//                    dto.setStudPhoneNumber(s.getStudPhoneNumber());
//                    dto.setStudRollNo(s.getStudRollNo());
//                    dto.setClassNumber(s.getClassNumber());
//                    dto.setImageUrl(s.getImageUrl());
//                    return dto;
//                })
//                .toList();
//    }
//
//
//    @Override
//    public void restoreStudent(Long id) {
//
//        Student s = studentRepository.findById(id)
//                .orElseThrow();
//
//        s.setDeleted(false);
//
//        studentRepository.save(s);
//    }
//
//    @Override
//    public void permanentDelete(Long id) {
//        studentRepository.deleteById(id);
//    }
//}



//====================================================================================== NEW

package com.example.stud_erp.service.Implementation;

import com.example.stud_erp.entity.ClassEntity;
import com.example.stud_erp.entity.School;
import com.example.stud_erp.entity.Student;
import com.example.stud_erp.payload.LoginRequest;
import com.example.stud_erp.payload.LoginResponse;
import com.example.stud_erp.payload.StudentDto;
import com.example.stud_erp.enums.StudentStatus;
import com.example.stud_erp.repository.ClassRepository;
import com.example.stud_erp.repository.SchoolRepository;
import com.example.stud_erp.repository.StudentRepository;
import com.example.stud_erp.service.ImageService;
import com.example.stud_erp.service.StudentService;
import com.example.stud_erp.utils.QRCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // =========================================================
    // CREATE STUDENT
    // =========================================================

    @Override
    public StudentDto createStudent(
            StudentDto dto,
            MultipartFile image
    ) throws IOException {

        // ================= EMAIL VALIDATION =================

        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        dto.setEmail(dto.getEmail().trim().toLowerCase());

        if (studentRepository.existsByEmail(dto.getEmail())) {

            throw new RuntimeException("Email already exists");
        }

        // ================= PHONE VALIDATION =================

        if (dto.getStudPhoneNumber() == null ||
                dto.getStudPhoneNumber().length() < 10) {

            throw new RuntimeException("Valid phone number required");
        }

        // ================= SCHOOL =================

        if (dto.getSchoolId() == null) {
            throw new RuntimeException("School ID is required");
        }

        School school = schoolRepository.findById(dto.getSchoolId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "School not found with ID : "
                                        + dto.getSchoolId()
                        )
                );

        System.out.println("DTO SCHOOL ID : " + dto.getSchoolId());

        System.out.println("DTO CLASS ID : " + dto.getClassId());
        // ================= CLASS =================

        ClassEntity cls = classRepository.findById(
                        dto.getClassId()
                )
                .orElseThrow(() ->
                        new RuntimeException("Class not found")
                );

        // ================= ENTITY =================

        Student student = new Student();

        // ================= BASIC INFO =================

        student.setSchool(school);

        student.setStudfirstName(dto.getStudfirstName());
        student.setStudlastName(dto.getStudlastName());

        student.setStudFatherName(
                dto.getStudFatherName()
        );

        student.setEmail(dto.getEmail());

        student.setGender(dto.getGender());

        student.setStudentDob(dto.getStudentDob());

        student.setBloodGroup(dto.getBloodGroup());

        student.setReligion(dto.getReligion());

        student.setNationality(dto.getNationality());

        student.setStudCategory(dto.getStudCategory());

        student.setStudCaste(dto.getStudCaste());

        student.setAadhaarNumber(dto.getAadhaarNumber());

        // ================= CONTACT =================

        student.setStudPhoneNumber(dto.getStudPhoneNumber());

        student.setFatherPhone(dto.getFatherPhone());

        student.setFatherEmail(dto.getFatherEmail());

        student.setMotherName(dto.getMotherName());

        student.setMotherPhone(dto.getMotherPhone());

        // ================= ADDRESS =================

        student.setAddress(dto.getAddress());

        student.setCity(dto.getCity());

        student.setState(dto.getState());

        student.setPincode(dto.getPincode());

        // ================= ACADEMIC =================

        student.setClassName(cls.getClassName());

        student.setClassEntity(cls);

        student.setSection(dto.getSection());

        student.setAdmissionDate(dto.getAdmissionDate());

        student.setStatus(StudentStatus.ACTIVE);

        // ================= EXTRA =================

        student.setPreviousSchool(dto.getPreviousSchool());

        student.setMonthlyFee(dto.getMonthlyFee());

        student.setDiscountedStudent(dto.isDiscountedStudent());

        // ================= TRANSPORT =================

        student.setTransportRequired(dto.isTransportRequired());

        student.setPickupPoint(dto.getPickupPoint());

        student.setAssignedBusRoute(dto.getAssignedBusRoute());

        // ================= PARENT ACCOUNT =================

        student.setCreateParentAccount(
                dto.isCreateParentAccount()
        );

        // ================= AUTO STUDENT ID =================

        String studentId;

        do {

            long random =
                    (long)(Math.random() * 9000) + 1000;

            studentId =
                    "STU"
                            + Year.now().getValue()
                            + random;

        } while (
                studentRepository.findByStudentId(studentId).isPresent()
        );

        // ================= USERNAME =================

        String baseUsername =
                dto.getStudfirstName()
                        .toLowerCase()
                        .replaceAll("\\s+", "");

        String username =
                baseUsername
                        + studentId.substring(studentId.length() - 4);

        while (studentRepository.existsByUsername(username)) {

            username =
                    username + (int)(Math.random() * 100);
        }

        // ================= PASSWORD =================

        String rawPassword =
                dto.getStudfirstName().substring(0, 1).toUpperCase()
                        + "@"
                        + dto.getStudPhoneNumber()
                        .substring(
                                dto.getStudPhoneNumber().length() - 4
                        );

// ================= SET GENERATED VALUES =================

        student.setStudentId(studentId);

        student.setUsername(username);

        student.setPassword(
                passwordEncoder.encode(rawPassword)
        );

        // ================= ROLL NUMBER =================

        Long totalStudents =
                studentRepository
                        .countBySchoolIdAndClassNameAndIsDeletedFalse(
                                dto.getSchoolId(),
                                cls.getClassName()
                        );

        student.setStudRollNo(totalStudents + 1);

        // ================= IMAGE =================

        if (image != null && !image.isEmpty()) {

            String imageUrl =
                    imageService.uploadImage(image);

            student.setProfileImage(imageUrl);
        }

        // ================= QR CODE =================

        String qrData =
                "{"
                        + "\"studentId\":\"" + student.getStudentId() + "\","
                        + "\"name\":\"" + student.getFullName() + "\","
                        + "\"fatherName\":\"" + student.getStudFatherName() + "\","
                        + "\"class\":\"" + student.getClassName() + "\","
                        + "\"section\":\"" + student.getSection() + "\","
                        + "\"rollNo\":\"" + student.getStudRollNo() + "\","
                        + "\"phone\":\"" + student.getStudPhoneNumber() + "\","
                        + "\"email\":\"" + student.getEmail() + "\","
                        + "\"school\":\"" + school.getSchoolName() + "\","
                        + "\"address\":\"" + student.getAddress() + "\""
                        + "}";

        String qrPath =
                "uploads/qrcodes/"
                        + studentId
                        + ".png";

        QRCodeGenerator.generateQRCode(
                qrData,
                qrPath
        );

        student.setQrCodeUrl(qrPath);

        // ================= SAVE =================

        Student savedStudent =
                studentRepository.save(student);

        StudentDto response =
                mapToDto(savedStudent);

        response.setPassword(rawPassword);

        return response;
    }



    // =========================================================
    // UPDATE STUDENT
    // =========================================================

    @Override
    public StudentDto updateStudent(
            Long id,
            StudentDto dto,
            MultipartFile image
    ) throws IOException {

        Student student =
                studentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        // ================= UPDATE =================

        student.setStudfirstName(dto.getStudfirstName());

        student.setStudlastName(dto.getStudlastName());

        student.setEmail(dto.getEmail());

        student.setStudPhoneNumber(dto.getStudPhoneNumber());

        student.setGender(dto.getGender());

        student.setStudentDob(dto.getStudentDob());

        student.setBloodGroup(dto.getBloodGroup());

        student.setReligion(dto.getReligion());

        student.setNationality(dto.getNationality());

        student.setStudCategory(dto.getStudCategory());

        student.setStudCaste(dto.getStudCaste());

        student.setAadhaarNumber(dto.getAadhaarNumber());

        student.setFatherPhone(dto.getFatherPhone());

        student.setFatherEmail(dto.getFatherEmail());

        student.setMotherName(dto.getMotherName());

        student.setMotherPhone(dto.getMotherPhone());

        student.setAddress(dto.getAddress());

        student.setCity(dto.getCity());

        student.setState(dto.getState());

        student.setPincode(dto.getPincode());

        student.setSection(dto.getSection());

        student.setMonthlyFee(dto.getMonthlyFee());

        student.setTransportRequired(
                dto.isTransportRequired()
        );

        student.setPickupPoint(dto.getPickupPoint());

        student.setAssignedBusRoute(
                dto.getAssignedBusRoute()
        );

        if (dto.getClassId() != null) {

            ClassEntity cls =
                    classRepository.findById(dto.getClassId())
                            .orElseThrow(() ->
                                    new RuntimeException("Class not found")
                            );

            student.setClassEntity(cls);

            student.setClassName(cls.getClassName());
        }

        // ================= IMAGE =================

        if (image != null && !image.isEmpty()) {

            String imageUrl =
                    imageService.uploadImage(image);

            student.setProfileImage(imageUrl);
        }

        Student updatedStudent =
                studentRepository.save(student);

        return mapToDto(updatedStudent);
    }

    // =========================================================
    // DELETE STUDENT
    // =========================================================

    @Override
    public void deleteStudent(Long id) {

        Student student =
                studentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        student.setDeleted(true);

        studentRepository.save(student);
    }

    // =========================================================
    // RESTORE STUDENT
    // =========================================================

    @Override
    public void restoreStudent(Long id) {

        Student student =
                studentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        student.setDeleted(false);

        studentRepository.save(student);
    }

    // =========================================================
    // PERMANENT DELETE
    // =========================================================

    @Override
    public void permanentDelete(Long id) {

        studentRepository.deleteById(id);
    }

    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    @Override
    public List<StudentDto> getAllStudents(Long schoolId) {

        return studentRepository
                .findBySchoolIdAndIsDeletedFalse(schoolId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // =========================================================
    // GET DELETED STUDENTS
    // =========================================================

    @Override
    public List<StudentDto> getDeletedStudents(Long schoolId) {

        return studentRepository
                .findBySchoolIdAndIsDeletedTrue(schoolId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // =========================================================
    // GET STUDENTS BY CLASS
    // =========================================================

    @Override
    public List<StudentDto> getStudentsByClass(
            Long schoolId,
            String className
    ) {

        return studentRepository
                .findBySchoolIdAndClassNameAndIsDeletedFalse(
                        schoolId,
                        className
                )
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // =========================================================
    // GET STUDENT BY ID
    // =========================================================

    @Override
    public StudentDto getStudentById(Long id) {

        Student student =
                studentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        return mapToDto(student);
    }

    // =========================================================
    // GET BY STUDENT ID
    // =========================================================

    @Override
    public StudentDto getByStudentId(String studentId) {

        Student student =
                studentRepository.findByStudentId(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        return mapToDto(student);
    }

    // =========================================================
    // GET ENTITY BY ID
    // =========================================================

    @Override
    public Student getStudentEntityById(Long id) {

        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        )
                );
    }

    // =========================================================
    // TOTAL STUDENTS
    // =========================================================

    @Override
    public Long getTotalStudents(Long schoolId) {

        return studentRepository
                .countBySchoolIdAndIsDeletedFalse(schoolId);
    }

    @Override
    public Long getTotalActiveStudents(Long schoolId) {

        return studentRepository
                .countBySchoolIdAndStatusAndIsDeletedFalse(
                        schoolId,
                        StudentStatus.ACTIVE
                );
    }

    @Override
    public Long getTotalDeletedStudents(Long schoolId) {

        return studentRepository
                .countBySchoolIdAndIsDeletedTrue(schoolId);
    }

    // =========================================================
    // LOGIN
    // =========================================================

    @Override
    public LoginResponse authenticateUser(
            LoginRequest request
    ) {

        Student student =
                studentRepository.findByUsername(
                                request.getUsername()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        if (!passwordEncoder.matches(
                request.getPassword(),
                student.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid password"
            );
        }

        studentRepository.save(student);

        LoginResponse response =
                new LoginResponse();

        response.setId(student.getId());

        response.setName(student.getFullName());

        response.setUsername(student.getUsername());

        response.setEmail(student.getEmail());

        response.setRole("STUDENT");

        response.setSchoolId(
                student.getSchool().getId()
        );

        response.setSchoolName(
                student.getSchool().getSchoolName()
        );

        return response;
    }

    // =========================================================
    // SEARCH STUDENTS
    // =========================================================

    @Override
    public List<StudentDto> searchStudents(
            Long schoolId,
            String keyword
    ) {

        return studentRepository
                .searchStudents(
                        schoolId,
                        keyword
                )
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // =========================================================
    // GET STUDENT BY QR
    // =========================================================

    @Override
    public StudentDto getStudentByQrCode(
            String qrCode
    ) {

        Student student =
                studentRepository.findByStudentId(qrCode)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        return mapToDto(student);
    }

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    @Override
    public void updateStudentStatus(
            Long studentId,
            String status
    ) {

        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        student.setStatus(
                StudentStatus.valueOf(status)
        );

        studentRepository.save(student);
    }

    // =========================================================
    // DTO MAPPER
    // =========================================================

    private StudentDto mapToDto(Student s) {

        StudentDto dto = new StudentDto();

        dto.setId(s.getId());

        dto.setStudentId(s.getStudentId());

        dto.setUsername(s.getUsername());

        dto.setEmail(s.getEmail());

        dto.setAdmissionDate(s.getAdmissionDate());

        dto.setStatus(s.getStatus());

        dto.setClassName(s.getClassName());

        dto.setSection(s.getSection());

        dto.setStudRollNo(s.getStudRollNo());

        dto.setStudfirstName(s.getStudfirstName());

        dto.setStudlastName(s.getStudlastName());

        dto.setFullName(s.getFullName());

        dto.setStudFatherName(s.getStudFatherName());

        dto.setGender(s.getGender());

        dto.setStudentDob(s.getStudentDob());

        dto.setStudentAge(s.getStudentAge());

        dto.setBloodGroup(s.getBloodGroup());

        dto.setReligion(s.getReligion());

        dto.setNationality(s.getNationality());

        dto.setStudCategory(s.getStudCategory());

        dto.setStudCaste(s.getStudCaste());

        dto.setAadhaarNumber(s.getAadhaarNumber());

        dto.setStudPhoneNumber(s.getStudPhoneNumber());

        dto.setFatherPhone(s.getFatherPhone());

        dto.setFatherEmail(s.getFatherEmail());

        dto.setMotherName(s.getMotherName());

        dto.setMotherPhone(s.getMotherPhone());

        dto.setAddress(s.getAddress());

        dto.setCity(s.getCity());

        dto.setState(s.getState());

        dto.setPincode(s.getPincode());

        dto.setPreviousSchool(s.getPreviousSchool());

        dto.setMonthlyFee(s.getMonthlyFee());

        dto.setDiscountedStudent(
                s.isDiscountedStudent()
        );

        dto.setTransportRequired(
                s.isTransportRequired()
        );

        dto.setPickupPoint(s.getPickupPoint());

        dto.setAssignedBusRoute(
                s.getAssignedBusRoute()
        );

        dto.setCreateParentAccount(
                s.isCreateParentAccount()
        );

        dto.setProfileImage(
                s.getProfileImage()
        );

        dto.setQrCodeUrl(
                s.getQrCodeUrl()
        );

        dto.setDeleted(s.isDeleted());

        dto.setCreatedBy(s.getCreatedBy());

        dto.setUpdatedBy(s.getUpdatedBy());

        dto.setCreatedAt(s.getCreatedAt());

        dto.setUpdatedAt(s.getUpdatedAt());

        if (s.getSchool() != null) {

            dto.setSchoolId(
                    s.getSchool().getId()
            );

            dto.setSchoolName(
                    s.getSchool().getSchoolName()
            );
        }

        return dto;
    }
}